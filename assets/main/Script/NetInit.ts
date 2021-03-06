import { PackageBase } from "./net/PackageBase";
import BaseNode from './base/BaseNode';
import { Message } from "./net/NetDefine";
import UIManager from './manager/UIManager';
import PlatformManager from './manager/PlatformManager';
import { app } from "./app";
const {ccclass, property} = cc._decorator;


@ccclass
export default class NetInit extends BaseNode {
    ipIndex = 0;
    accountID = '869614036237425';
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.onEventUI('NetInit',()=>{
            this.init();
        },'uiBaseEvent');
        this.onEventUI('socketClose',()=>{
            this.connectSever();
        },'uiBaseEvent');
        this.onEventUI('onResume',()=>{
            this.sendHeartBeat();
        },'uiBaseEvent');
        this.onEventUI('reqGuanKaInfo',(tag)=>{
            this.reqGuanKaInfo(tag);
        },'uiBaseEvent');


    }
    onDisable(){
        //重载，防止监听函数消失
    }
    onEnable(){

    }

    init () {
        let listeners = ['BackLogin','Logout','SendLvlExp','UserAttr','GuanKaInfoList','UpdateLeftTiliSec' ];
        this.register(listeners);
        //--------------------------------------------------  

        if (cc.sys.isBrowser) {
            let searchHref = window.location.search.replace('?', '');
            if (searchHref!='') {
                this.accountID = searchHref;  
            }
        }
        if (CC_PREVIEW||cc.sys.isBrowser) {
            app.loginParam.accountID = app.loginParam.accountID || this.accountID;
        }
        this.connectSever();
        this.schedule(this.sendHeartBeat, 10);
    }
    connectSever(){
        app.sever.close();
        let IPs;
        if (cc.sys.isBrowser||CC_DEBUG) {
            IPs = app.ipConfig.wsIPs;
        }else{
            IPs = app.ipConfig.wssIPs;
        }

        if (!IPs || IPs.length <= this.ipIndex) {
            let args = {
                isConfirm: true,
                content: '服务器维护中，请稍后再试...'
            }
            app.uiManager.showUI('TipPanel', args, () => {
                this.ipIndex = 0;
                this.connectSever();
            });
            return;
        }
        
        let ipCur = IPs[this.ipIndex];
        
        app.sever.setServerInfo({ip:ipCur,port:31700});
        app.sever.connect(() => {
            cc.log('connect success');
            app.waitingPanel.hide();

            if (CC_PREVIEW||cc.sys.isBrowser) {
                this.sendVisitorLogin();
            }else{
                this.sendWechatLogin(); 
            }
        },(err)=>{
            app.waitingPanel.hide();
            this.sendLoginFail();
            this.ipIndex++;
            this.connectSever();
        });
        //创建链接超时处理
        app.waitingPanel.show(5,()=>{
            this.sendLoginFail();
            this.ipIndex++;
            this.connectSever();
        });
    }

    sendHeartBeat() {
        if (app.sever && app.sever.isNetOK()) {
            let HeartBeat = new app.PB.message.HeartBeat();
            HeartBeat.time = new Date().getTime();
            let pack = new PackageBase(Message.HeartBeat);
            pack.d(HeartBeat).to(app.sever);
        }
    }
    Logout(res){
        let PB = app.PB;
        cc.log('Logout---',res);
        //被踢后清空socket
        app.sever.close();
        app.userData = {};
        let msg = '';
        switch (res.code) {
            case PB.message.Logout.RetCode.RC_OTHER:
                msg = '登录未知错误';
                break;
            case PB.message.Logout.RetCode.RC_CONFILICT_LOGIN:
                msg = '其它地方登录';
                break;
            case PB.message.Logout.RetCode.RC_LOGIN_CLOSED:
                msg = '登录关闭';
                break;
            case PB.message.Logout.RetCode.RC_GM:
                msg = '管理员踢下线';
                break;
            default:
                msg = '未知错误';
                break;
        }
        if (res.msg && res.msg.length > 0) {
            msg = msg + '：\n' + res.msg;
        }
        app.uiManager.showUI('TipPanel', { content: msg, isConfirm: true },()=>{
            cc.game.end();
        });
    }

    BackLogin(res){
        let PB = app.PB;
        cc.log('LOGIN---',res);
        app.waitingPanel.hide();
        if (res.code == 0) {
            app.userData = res;
            app.oldRoleData = Math.ceil(app.userData.data.lvl/10);
            app.uiViewEvent.emit('UpdateUserInfo');
            cc.sys.localStorage.setItem('idomLoginParam', JSON.stringify(app.loginParam));

            this.sendConnectData();
            this.reqGuanKaInfo();
            if (cc.director.getScene().name == 'LoadingScene') {
                if ((res.data.bitVal&1)==0) {
                    app.uiManager.showUI('NewPlayerPanel');
                }else{
                    cc.director.loadScene('Hall');
                }
            }          
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
            
            this.sendLoginFail(res.code,app.loginParam.session);
        }

    }

    sendConnectData() {
        let IPs;
        if (cc.sys.isBrowser||CC_DEBUG) {
            IPs = app.ipConfig.wsIPs;
        }else{
            IPs = app.ipConfig.wssIPs;
        }
        let PB = app.PB;
        //发送登录数据，供服务器参考
        let channelData = {
            ipArr: IPs,
            domain: app.channelConfig.domain,
            channel: app.channelConfig.channel,
            group: app.channelConfig.group
        };
        let msg = new PB.message.SendConnect();
        msg.str = JSON.stringify(channelData) + '|' + IPs[this.ipIndex];
        let pack = new PackageBase(Message.SendConnect);
        pack.d(msg).to(app.sever);
    }

    sendVisitorLogin(){
        let PB = app.PB;

        let imei: string = app.platform.getIMEI();
        cc.log('imei==',imei);
        if (imei == '') {
            imei = app.loginParam.accountID;
        }

        let Login = new PB.message.Login();
        Login.BuildNo = app.versionCode;
        Login.Env = 'test';
        Login.EnterComplete = true;
        Login.tick = new Date().getTime();
        Login.content = imei;
        Login.ip = app.clientIP;
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
        wx.login({
            success: (res) => {
                app.waitingPanel.hide()
                console.log('wx.login---success!!!', res);

                let Login = new PB.message.Login();
                Login.BuildNo = app.versionCode;
                Login.Env = 'mp';
                Login.EnterComplete = true;
                Login.tick = new Date().getTime();
                Login.content = res.code;
                Login.ip = app.clientIP;
                Login.os = cc.sys.os + '_' + app.versionCode;
                Login.device = app.platform.getPhoneType();
                Login.group = app.channelConfig.group;
                let pack = new PackageBase(Message.Login);
                pack.d(Login).to(app.sever);
                console.log('loginData == ', Login);
                app.loginData = Login;
            },
            fail: (res) => {
                app.waitingPanel.hide()
                console.log('wx.login---fail!!!', res);
            }
        });
        
    }

    

    sendLoginFail(code:number = app.NetError.ConnentFail, session = '') {
        // let params = {
        //     severip: app.ipConfig.ipArr[this.ipIndex],
        //     clientip: app.clientIP,
        //     group: app.channelConfig.group,
        //     channel: app.channelConfig.channel,
        //     session: session,
        //     code: code,
        //     device: app.platform.getPhoneType(),
        //     os: cc.sys.os,
        //     uuid: app.platform.getIMEI()
        // }
        // HttpFormPost('api/v1/user/login/failed', { content: JSON.stringify(params) }, (res) => {
        //     cc.log(res);
        // });
    }
    UserAttr(res){
        console.log('UserAttr',res)
        let data = res.list;
        for (let index = 0; index < data.length; index++) {
            const attr = data[index];
            let valueType = Message.attrNameMapValue[attr.name];
            app.userData.data[attr.name] = attr[valueType];
        }
        app.uiViewEvent.emit('UpdateUserInfo');
    }
    SendLvlExp(res){
        console.log('SendLvlExp',res)
        if (res.lvlup) {
            app.oldLevelData.push(res);
        }
        app.levelData = res;
        app.uiViewEvent.emit('UpdateLevelInfo');
    }
    reqGuanKaInfo(tag='main'){
        if (tag == 'main') {
            if (!app.checkPointData.id || app.checkPointData.id != app.userData.lastGuanKa[tag]) {
                let RequestGuanKaInfo = new app.PB.message.RequestGuanKaInfo();
                RequestGuanKaInfo.startId = app.userData.lastGuanKa[tag];
                RequestGuanKaInfo.num = 1;
                RequestGuanKaInfo.tag = tag;
                let pack = new PackageBase(Message.RequestGuanKaInfo);
                pack.d(RequestGuanKaInfo).to(app.sever);
            }
        } else {
            let RequestGuanKaInfo = new app.PB.message.RequestGuanKaInfo();
            RequestGuanKaInfo.startId = app.userData.lastGuanKa[tag];
            RequestGuanKaInfo.num = 1;
            RequestGuanKaInfo.tag = tag;
            let pack = new PackageBase(Message.RequestGuanKaInfo);
            pack.d(RequestGuanKaInfo).to(app.sever);
        }
    }
    GuanKaInfoList(res){
        console.log('GuanKaInfoList--',res);
        if (res.tag == 'day') {
            app.dailyGameData = res.list[0];
        }else{
            app.checkPointData = res.list[0];
            if (app.checkPointData) {
                cc.sys.localStorage.setItem('checkPointData', JSON.stringify(app.checkPointData));
            } else {
                cc.sys.localStorage.setItem('checkPointData', '');
            }
        }
        
        app.uiViewEvent.emit('CheckPointInit',res.tag,app.userData.lastGuanKa[res.tag]);
    }
    UpdateLeftTiliSec(res){
        console.log(res);
        app.powerData = res;
    }

    // update (dt) {}
}
