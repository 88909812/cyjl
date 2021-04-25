import * as PBKiller from './libs/pbkiller/src/pbkiller';
import UIManager from './manager/UIManager';
import SoundManager from './manager/SoundManager';
import PlatformManager from './manager/PlatformManager';
import { SocketServer } from "./net/SocketServer";
import { PackageBase } from "./net/PackageBase";
import { Message } from "./net/NetDefine";
import { DomainGet } from "./net/DomainGet";
import { HttpUrlGet,HttpGetIP } from './net/HttpRequest';
import { app } from './app';
const {ccclass, property} = cc._decorator;

@ccclass
export default class AppInit extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        cc.debug.setDisplayStats(false);
        if (CC_PREVIEW||cc.sys.isBrowser) {
            window['app'] = app;
        }
        //读取本地缓存的用户数据
        app.userConfig = {};
        let userConfigStr = cc.sys.localStorage.getItem('idomUserConfig');
        if (userConfigStr) {
            app.userConfig = JSON.parse(userConfigStr);
        }

        app.loginParam = {};
        let loginParamStr = cc.sys.localStorage.getItem('idomLoginParam');
        if (loginParamStr) {
            app.loginParam = JSON.parse(loginParamStr);
        }

        PBKiller.preload(() => {
            console.log(PBKiller.loadAll());
            app.PB = PBKiller.loadAll();
            app.sever = new SocketServer();
            this.initNet();
        });

        app.uiBaseEvent.on('onResume',()=>{
            this.sendHeartBeat();
        });
    }

    start () {
        app.platform = PlatformManager.getIns();
        app.uiManager = UIManager.getIns();
        app.soundManager = SoundManager.getIns();

        app.platform.setKeepScreenOn();
        app.statusBarHeight = app.platform.getStatusBarHeight();

        if (cc.sys.isNative) {
            HttpGetIP((ip) => {
                app.clientIP = ip;
            })
        }
        app.platform.gameInitComplete();
    }
    initNet(){
        let domainConfig = new DomainGet();
        domainConfig.initDomain();
        this.schedule(this.sendHeartBeat, 10);
        app.sever.registerHandlers(this,['Logout']);
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
        this.scheduleOnce(()=>{
            app.uiManager.showUI('TipPanel', { content: msg, isConfirm: true });
        },0.5);
        
        cc.director.loadScene('LoginScene');
    }
    // update (dt) {}
}
