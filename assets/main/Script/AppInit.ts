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

            let domainConfig = new DomainGet();
            domainConfig.initDomain();

            app.uiBaseEvent.emit('NetInit');
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
    
    // update (dt) {}
}
