import * as PBKiller from './libs/pbkiller/src/pbkiller';
import UIManager from './manager/UIManager';
import SoundManager from './manager/SoundManager';
import PlatformManager from './manager/PlatformManager';
import { SocketServer } from "./net/SocketServer";
import { DomainGet } from "./net/DomainGet";
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
        if (!cc.sys.isBrowser) {
            let loginParamStr = cc.sys.localStorage.getItem('idomLoginParam');
            if (loginParamStr) {
                app.loginParam = JSON.parse(loginParamStr);
            }
        }


        //读取本地关卡数据
        app.checkPointData = {};
        let checkPointDataStr = cc.sys.localStorage.getItem('checkPointData');
        if (checkPointDataStr) {
            app.checkPointData = JSON.parse(checkPointDataStr);
        }

        PBKiller.preload(() => {
            console.log(PBKiller.loadAll());
            app.PB = PBKiller.loadAll();
            app.sever = new SocketServer();

            let domainConfig = new DomainGet();
            domainConfig.initDomain();
        });

        app.platform = PlatformManager.getIns();
        app.uiManager = UIManager.getIns();
        app.soundManager = SoundManager.getIns();
    }

    start () {
        app.platform.setKeepScreenOn();
        app.statusBarHeight = app.platform.getStatusBarHeight();

        //*****微信小游戏不支持正则中包含?< 后续处理下*****
        // if (cc.sys.isNative) {
        //     HttpGetIP((ip) => {
        //         app.clientIP = ip;
        //     })
        // }
        //***************************************** */
        app.platform.gameInitComplete();
    }
    


    // update (dt) {

    // }
}
