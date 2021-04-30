import { PackageBase } from "../net/PackageBase";
import BaseNode from '../base/BaseNode';
import { Message } from "../net/NetDefine";
import {HttpFormPost} from '../net/HttpRequest';
import UIManager from '../manager/UIManager';
import PlatformManager from '../manager/PlatformManager';
import { app } from "../app";
const {ccclass, property} = cc._decorator;
//异或的密钥
const KEY = 0x88;

@ccclass
export default class Hall extends BaseNode {
    @property(cc.Node)
    btnVisitorLogin:cc.Node = null;
    @property(cc.Node)
    btnWechatLogin:cc.Node = null;
    @property(cc.Node)
    btnCopyAccount:cc.Node = null;
    @property(cc.Label)
    versionCode:cc.Label = null;
    accInput:cc.EditBox = null;
    ipIndex = 0;

    accountID = '869614036237424';
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();

        this.setLoginBtnActive(false);
        this.accInput = this.node.getComponentInChildren(cc.EditBox);
        if (CC_PREVIEW||cc.sys.isBrowser) {
            this.btnWechatLogin.destroy();
            this.btnWechatLogin = null;
            app.loginParam.accountID = app.loginParam.accountID || this.accountID;
            this.accInput.string = app.loginParam.accountID;
        } else {
            this.btnVisitorLogin.destroy();
            this.btnVisitorLogin = null;

            if (app.loginParam.session) {
                this.accInput.string = app.loginParam.session;
            }
        }
        this.versionCode.string = 'v'+app.versionCode;

        this.accInput.node.active = false;
        this.btnCopyAccount.active = false;
    }

    start () {
        app.sever.close();

        if (CC_PREVIEW) {
            this.accInput.node.active = true;
            this.btnCopyAccount.active = true;
            for (let index = 0; index < app.ipConfig.ipArr.length; index++) {
                const ipData = app.ipConfig.ipArr[index];
                let ipNode = new cc.Node('ipNode');
                ipNode.parent = this.node;
                ipNode.color = cc.color(255, 255, 255);
                ipNode.y = 200 + index*100;
                ipNode.addComponent(cc.Label).string = ipData;
                ipNode.on('touchend', () => {
                    this.ipIndex = index;
                    app.uiManager.showUI('MessageNode', '已修改ip为：' + app.ipConfig.ipArr[this.ipIndex]);
                    this.setLoginBtnActive(true);
                });
            }
        }else{
            //todo:如果有登录记录，则刷新session直接登录(点击退出登录时，记得清空app.loginParam.session！！！)
            if (!this.isNeedWechatAuth()) {
                this.updateSession();
            } else {
                this.setLoginBtnActive(true);
            }
        }
        //--------------------------------------------------
    }
    onEnable(){
        super.onEnable();

        this.onEventUI('WXSendAuthCallBack',(errCode,code)=>{
            if (errCode == 0) {
                //这里需要去http服务器获取session
                this.scheduleOnce(()=>{
                    this.requireSession(code);
                },0.05); 
            }else{
                this.setLoginBtnActive(true);
                let args = {
                    isConfirm:true,
                    content:'需要用户授权后才能登录游戏'
                }
                app.uiManager.showUI('TipPanel',args,()=>{
                    app.platform.WXSendAuth();
                });
            }
        });

        let listeners = ['BackLogin' ];
        this.register(listeners);
    }
    connectSever(){
        app.sever.close();

        if (!app.ipConfig.ipArr || app.ipConfig.ipArr.length <= this.ipIndex) {
            let args = {
                isConfirm: true,
                content: '服务器维护中，请稍后再试'
            }
            app.uiManager.showUI('TipPanel', args, () => {
                this.ipIndex = 0;
                this.connectSever();
            });
            return;
        }

        let ipCur = app.ipConfig.ipArr[this.ipIndex];
        app.sever.setServerInfo({ip:ipCur,port:31700});
        app.sever.connect(() => {
            cc.log('connect success');
            app.waitingPanel.hide();

            if (this.btnWechatLogin) {
                this.sendWechatLogin(); 
            }else{
                this.sendVisitorLogin();
            }
        });
        app.waitingPanel.show(5,()=>{
            this.sendLoginFail();
            this.ipIndex++;
            this.connectSever();
        });
    }
    updateSession(){
        let imei: string = app.platform.getIMEI();
        if (imei == '') {
            imei = this.accountID;
        }
        let params = {
            session_id: app.loginParam.session,
            account_id: app.loginParam.userId,
            group_name:app.channelConfig.group,
            uuid: imei,
        };
        HttpFormPost('api/v1/user/refresh-session',params,(res)=>{
            if (res.code == 0) {
                app.loginParam.session = res.data.session;
                cc.sys.localStorage.setItem('idomLoginParam', JSON.stringify(app.loginParam));
                if (res.data.ips && res.data.ips.length != 0) {
                    app.ipConfig.ipArr = [];
                    for (let index = 0; index < res.data.ips.length; index++) {
                        let address = res.data.ips[index];
                        let port = '';
                        let ip = address;
                        if (address.indexOf(":") != -1) {
                            port = address.substr(address.indexOf(":"));
                            ip = address.substr(0, address.indexOf(":"));
                        }
                        app.ipConfig.ipArr.push(this.Decrypt(ip) + port);
                    }
                    this.connectSever();
                }else{
                    app.uiManager.showUI('MessageNode','登录入口未开启');
                    this.setLoginBtnActive(true);
                }
            }else if (res.code == 1006) {
                this.sendLoginFail(res.code,app.loginParam.session);
                app.loginParam.session = '';
                let args = {
                    isConfirm:true,
                    content:'用户授权已过期，请重新授权'
                }
                app.uiManager.showUI('TipPanel',args,()=>{
                    app.platform.WXSendAuth();
                },()=>{
                    app.platform.WXSendAuth();
                });
            }else{
                app.uiManager.showUI('MessageNode',res.message);
                this.setLoginBtnActive(true);
            }
        },()=>{
            this.sendLoginFail(app.NetError.HttpReqFail,app.loginParam.session);
            let args = {
                isConfirm:true,
                content:'网络状态不佳，请在网络稳定后重试'
            }
            app.uiManager.showUI('TipPanel',args,()=>{
                this.updateSession();
            });
        });
    }

    requireSession(code){
        let imei: string = app.platform.getIMEI();
        if (imei == '') {
            imei = this.accountID;
        }
        let params = {
            app_id: app.platform.getWechatAppID(),
            code: code,
            source: app.channelConfig.channel,
            uuid: imei,
            group_name:app.channelConfig.group
        };
        HttpFormPost('api/v1/user/login/wechat',params,(res)=>{
            if (res.code == 0) {
                app.loginParam.session = res.data.session;
                cc.sys.localStorage.setItem('idomLoginParam', JSON.stringify(app.loginParam));

                if (res.data.ips && res.data.ips.length != 0) {
                    app.ipConfig.ipArr = [];
                    for (let index = 0; index < res.data.ips.length; index++) {
                        let address = res.data.ips[index];
                        let port = '';
                        let ip = address;
                        if (address.indexOf(":") != -1) {
                            port = address.substr(address.indexOf(":"));
                            ip = address.substr(0, address.indexOf(":"));
                        }
                        app.ipConfig.ipArr.push(this.Decrypt(ip) + port);
                    }
                    this.connectSever();
                }else{
                    app.uiManager.showUI('MessageNode','登录入口未开启');
                    this.setLoginBtnActive(true);
                }
            }else{
                this.sendLoginFail(res.code);
                app.uiManager.showUI('MessageNode',res.message);
                this.setLoginBtnActive(true);
            }
        },()=>{
            this.sendLoginFail(app.NetError.HttpReqFail);
            let args = {
                isConfirm:true,
                content:'网络状态不佳，请在网络稳定后重试'
            }
            app.uiManager.showUI('TipPanel',args,()=>{
                this.requireSession(code);
            });
        });
        
    }

    BackLogin(res){
        let PB = app.PB;
        cc.log('LOGIN---',res);
        app.waitingPanel.hide();
        if (res.code == 0) {
            app.userData = res.data;
            app.userData.yesterdayPerShareholder = res.yesterdayPerShareholder;
            app.userData.videoNum = res.videoNum;
          
            cc.sys.localStorage.setItem('idomLoginParam', JSON.stringify(app.loginParam));

            this.sendConnectData();

            cc.director.loadScene('GameScene');
            
        }else{
            let tipStr = '';
            switch (res.code) {
                case PB.message.BackLogin.RetCode.RC_FORBIDDEN_ACCOUNT: tipStr = '账号被封停'; break;
                case PB.message.BackLogin.RetCode.RC_LOGIN_CLOSED: tipStr = '登录关闭'; break;
                case PB.message.BackLogin.RetCode.RC_ACCOUNT_NOT_EXIST: tipStr = '账号不存在'; break;
                case PB.message.BackLogin.RetCode.RC_FORBIDDEN_DEVICE: tipStr = '无效的身份'; break;
                case PB.message.BackLogin.RetCode.RC_FORBIDDEN_IP: tipStr = '被屏蔽的IP'; break;
                case PB.message.BackLogin.RetCode.RC_INVALID_SESSION: tipStr = '用户登录凭证失效'; break;
                case PB.message.BackLogin.RetCode.RC_VERSION_ERROR: tipStr = '客户端版本过低'; break;
                case PB.message.BackLogin.RetCode.RC_PASSWORD_ERROR: tipStr = '密码错误'; break;
                case PB.message.BackLogin.RetCode.RC_ILLEGAL_CONTENT: tipStr = '非法字段'; break;
                default:tipStr = '登录时遇到未知错误'; break;
            }
            if (res.msg && res.msg.length > 0) {
                tipStr = tipStr + ':' + res.msg;
            }
            app.uiManager.showUI('MessageNode', tipStr);
            
            this.setLoginBtnActive(true);
            this.sendLoginFail(res.code,app.loginParam.session);
        }

    }

    sendConnectData() {
        let PB = app.PB;
        //发送登录数据，供服务器参考
        let channelData = {
            ipArr: app.ipConfig.ipArr,
            domain: app.channelConfig.domain,
            channel: app.channelConfig.channel,
            group: app.channelConfig.group
        };
        let msg = new PB.message.SendConnect();
        msg.str = JSON.stringify(channelData) + '|' + app.ipConfig.ipArr[this.ipIndex];
        let pack = new PackageBase(Message.SendConnect);
        pack.d(msg).to(app.sever);
    }

    onClickVisitor(){
        this.connectSever();
    }

    onClickWechat() {
        if (this.isNeedWechatAuth()) {
            app.platform.WXSendAuth();
        } else {
            this.updateSession();
        }
        this.setLoginBtnActive(false);
    }
    isNeedWechatAuth(){
        return !app.loginParam.session || app.loginParam.session == '' || !app.loginParam.userId;
    }
    sendVisitorLogin(){
        let PB = app.PB;

        let imei: string = app.platform.getIMEI();
        cc.log('imei==',imei);
        if (imei == '') {
            imei = app.loginParam.accountID;
        }

        let Login = new PB.message.Login();
        Login.uuid = imei;
        Login.BuildNo = app.versionCode;
        Login.os = cc.sys.os + '_' + app.versionCode;
        Login.device = app.platform.getPhoneType();
        Login.group = app.channelConfig.group;
        let pack = new PackageBase(Message.Login);
        pack.d(Login).to(app.sever);

        app.loginData = Login;
    }

    sendWechatLogin(){
        let PB = app.PB;
        
        app.waitingPanel.show(5,()=>{
            let args = {
                isConfirm:true,
                content:'登录超时，重新尝试'
            }
            app.uiManager.showUI('TipPanel',args,()=>{
                this.sendWechatLogin();
            });
            this.sendLoginFail(app.NetError.LoginOutTime,app.loginParam.session);
        });

        let Login = new PB.message.Login();
        Login.uuid = app.platform.getIMEI();
        Login.BuildNo = app.versionCode;
        Login.session = app.loginParam.session;
        Login.os = cc.sys.os + '_' + app.versionCode;
        Login.device = app.platform.getPhoneType();
        Login.group = app.channelConfig.group;
        let pack = new PackageBase(Message.Login);
        pack.d(Login).to(app.sever);

        app.loginData = Login;
    }

    

    setLoginBtnActive(bool:boolean){
        if (this.btnWechatLogin) {
            this.btnWechatLogin.active = bool;
        }

        if (this.btnVisitorLogin) {
            this.btnVisitorLogin.active = bool;
        }
    }

    onTextChanged(){
        if (CC_PREVIEW||cc.sys.isBrowser) {
            app.loginParam.accountID = this.accInput.string;
        }else{
            app.loginParam.session = this.accInput.string;
        }
    }
    onClickCopyAccount(){
        app.platform.setClipboardData(this.accInput.string);
    }
    sendLoginFail(code:number = app.NetError.ConnentFail, session = '') {
        let params = {
            severip: app.ipConfig.ipArr[this.ipIndex],
            clientip: app.clientIP,
            group: app.channelConfig.group,
            channel: app.channelConfig.channel,
            session: session,
            code: code,
            device: app.platform.getPhoneType(),
            os: cc.sys.os,
            uuid: app.platform.getIMEI()
        }
        HttpFormPost('api/v1/user/login/failed', { content: JSON.stringify(params) }, (res) => {
            cc.log(res);
        });
    }
    
    Swap(num) {
        //十进制转化为8位的二进制字符串
        let strBinary = ('0'.repeat(8)+parseInt(num).toString(2)).slice(-8);
        
        //二进制数相邻位互换
        let swapByteList = {};
        for (let index = 0; index < strBinary.length; index++) {
            swapByteList[index+1] = Number(strBinary[index]);
        }
        strBinary = "";
        for (let index = 1; index <= 7; index = index + 2) {
            swapByteList[index] = [swapByteList[index+1], swapByteList[index+1] = swapByteList[index]][0];
        }
        for (const key in swapByteList) {
            if (swapByteList.hasOwnProperty(key)) {
                strBinary += swapByteList[key];
            }
        }
	    return parseInt(strBinary, 2);
    }
    Decrypt(ip):string{
        let result = "";
        let resultStrArray = ip.split('.');
        for (let index = 0; index < resultStrArray.length; index++) {
            const element = resultStrArray[index];
            let decryptNum = Number(element) ^ KEY;//和秘钥的二进制异或
            let swapNum = this.Swap(decryptNum);
            if (!swapNum) {
                return '';
            }
            if (index === 0) {
                result += swapNum;
            }else{
                result += ('.'+swapNum);
            }
        }
        return result;
    }
    Encrypt(ip){
        let result = "";
        let resultStrArray = ip.split('.');
        for (let index = 0; index < resultStrArray.length; index++) {
            const element = resultStrArray[index];
            let swapNum = this.Swap(element);
            if (!swapNum) {
                return '';
            }
            if (index === 0) {
                result += swapNum;
            }else{
                result += ('.'+swapNum);
            }
        }
        return result;
    }
    // update (dt) {}
}
