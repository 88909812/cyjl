import WaitingPanel from "./components/WaitingPanel";
import PlatformManager from "./manager/PlatformManager";
import SoundManager from "./manager/SoundManager";
import UIManager from "./manager/UIManager";
import { SocketServer } from "./net/SocketServer";

export module app{
    export let MsgKeys = {
        D:'U2FsdGVkX19MzXd7LfEjdrJNV8jUOqLTJ9juF1FI6b+Rznyt97tyzmCf3DxUQ+Gk3evc2to8oPPKtrUKNXMuvrvQJgpNQuwE0dQNdwcPIMbeduIqD3DvwOF76tFsKyAHz5M38j0nwBFLz8ZZ0M5BWWAgWSVcNGU5jUiinEnGvPGcFhEVXrUDmc4q+NcEpqojCp8DGUyrt7E41uRHZWkdFn+eiuaOWedlqmxpumkJuKV0ww3Md5NQUIfArNxdU7KRiqR2T6A7hbXu6Yalan1/LNe9zBNZGvDJBrMIdv3nnJriSl1xIVQu9DVapoN4jE6dmMQU+gO7wcikyzpWVfIM6sDpGtP7zjhxvaF74s101UIFjA/eTy/90HZBkcJpmFIH/Sl0bT0eabmp0s/XJ5lpqFeJKIKE0aX734fiCZ3Ut32tmHvOBMyt4TG375PoZqcjKthfcZbZhQ5eAEpIB72ZkuktaHeldqdLfVkXwUNeqb/T/V9w+Kmvb/DtmOoOEB0B+7UauMFYnRU2jSuwte52NDiyfYqHmPjGOc06I8aw8zTRjsOHPIV77gL0g08zN+k9cPL/xhuFupl0twkCPZqqdV4uO9cpaJeoxJovHRHfnns7UjlLRsVo7q1swEhAehjujHmbcSGcYFt+jpdVYlrodwS9+A3cszfTxM9bbziKtN1kCLYHWceox/W6JKY+XDdtTq5Wj0XYyhnaaMGjje/2zNp4sfI57dX5tsbyIvjJMgoIHpWQ6DBkSjjY9eHsjB2UprZrvi5y9i7toFC6GndTv1TxyY8sKapt3Vxx7ZbiWkM0ZeD/UIAefoK1g2Hz0kl9YYCWUz76sBFwLwGEkP8SKtXvFJvDqc4DmOYpiAeiwg2YhnYcCV+lrhl0siH2Cx91g5n8KloJkAAOjnrf4WTeHWmpptJ3P1UC9+Fg0J21dFQ6zJi8nwNPTVd24xh6/hUkhln6FX2SfNgcfbeRN4FG55HBqrEUXW07x6vsHWYQggxAanJAR7Ue99axrc4KzFPg8/QKumz1/wyiAbjFAtK4/2G0Fq83sNPoBKp1qBWvQb8o1TwYOeJ8OJOXssGMS5PKH0+lKduPSnOxA73fGhzOxLXdLueaSfXunW+wIqKHABcOeaIbFGs/T2eOQcOrs3Jv2iDPADloCVkJEfS//eT7uf3UWO6cdDHbaYy84cw1it9U/x9/c7bmtPozkQd14mLDkB+zBGAHPbF5zyPPYKf1E/vLbszOyOZvCsSGCfKtWJo=',
        E:'U2FsdGVkX19hIL7zRecbqYDnjvjfz2nayo6rDVDWbm095vlQcM046yYfBUfF9iaffqNT5595EEOFdBsrCcnXyMyQV7JnidSgmNNCsvD9Xp081pHV+Aq8JtbJv+fUXYpDqh6c/Jg/5ISTJ+6FUCba1bCJq0sHp72f+aZu2K9SAmw+wBtPjL65LAPaT1yeUy1Z4r2Q07xfzgP2CiB79WYjs2wrc78wIQwu6KpASv/VDGBt5DJSe74pkc3uKhK4fuGzDIUuEPlVP+0CUaNWaXpXbdKHt172XbjdKGDoaVTsiZfdGd0FfTHEW7v1mvN/9GA3O1kDZnQ3GesuJGZPNs7YMQlrqpOvBYL/yzUeeHftSASwC/uJNS+OhGfLYuplOoJhbZpS5R3ty6YBc2mxxrn5lDXx7kMQ1lOFsR5OdmC9vbyz5mLGCtD1t71LNLpjb31K68Fl5tp0QdtoDQIZxFV9P+BfPA2qNb/bFPkAe+EU/CQn9Rzt5LloLv6IhA+DY02M30k0nX2DWFA5Xv/HHcSSSZI5kQMnaCoPhwm1UlNm1tBVFDvP1o5xnx9jZ1azp+WCzXh+/7cp9PyKI1xiRIksr3MNtHKqPg9sFxAqSQTd54gZpgaGNQD98fQRuFJJtrb0hC9vKYSiGho5BxKPddWY3jCBZDoTBEKJN6VQrNWW3gMirSy5kkLA6NOuBzzkQs6O2sVGxtipduhTRRscJ0y5itMIk7U1zbIvJOuO7Y+6nN8kn/kj1ns8fG0uDV5N98ys7hyIDRoD1B1isGbfqpfLrhicib8PkidLNkqQ8aJH/oUeRD66pOMcPGC2xZj3US0u/V57kUR6u89g9BoAXeD094ttz9oRRl3WzsqeXoBL+qiNLruhHxMTawiTpnqT0bEUg7STk/nPsnrLTI3lnNrCI4BIxvyLNoVW68gFlpeT9hc+x/pMbvIbhrwgg+BkMlWUDAsl8p2h2pSv6Y5JDWyVk7AF9JGc6I5v51suJUanA6OoGBE9DvTA1vG9zNBtsUPxsv9YMUfh0BgrdF1JjdCRW5yoctbHwvEp1OKPeYjqcKCP+xQRwIFbn6mnOaAiwUlnfr+wGiZfjp3BznahTTZBUKnVD/QkH7nipODy6zn9WJT1amFQS7xguxiXyoLdrsYud64Ljfk5l0WjF6s8TgUC2oL8oSJzO2bO13TufgqjD2R7hMKdnco1J3V+89MbFVH8QXyvSh+YOUvf2ERIpWgHEHidQ/XCRDCBEQxm1IhnoJk='
    };
    export let statusBarHeight = 0;
    export let PB:any = null;
    export let sever:SocketServer = null;

    export let clientIP = '';

    export let loginParam:any = {};
    export let loginData = null;
    export let userData:any = {};
    export let levelData:any = {};
    export let oldRoleData:any = null;
    export let oldLevelData:any[] = [];
    export let checkPointData:any = {};
    export let userConfig:any = {};
    export let powerData:any = {};

    export let uiViewEvent = new cc.EventTarget();//UI消息，用这个派发
    export let uiBaseEvent = new cc.EventTarget();//底层（基本不会隐藏的）UI消息，用这个派发（主要用于scollEx消息的冲突）

    export let versionCode = '1.0.0';
    export let ipConfig = {
        wsIPs:['echo.websocket.org','192.168.0.38:31700/ws','121.196.50.252:31700/ws'],
        wssIPs: ['cyjl.passball-tec.com:8443/ws/']
    };
    export let channelConfig = {
        domain: '121.196.50.252:8080',//http请求地址
        channel: 'a_01',
        group: 'test'
    };
    export let NetError={
        ConnentFail:-1,
        HttpReqFail:-2,
        LoginOutTime:-11
    }

    export let platform:PlatformManager = null;
    export let uiManager:UIManager = null;
    export let soundManager:SoundManager = null;


    export let waitingPanel:WaitingPanel = null;

    export let IdiomPos:cc.Vec3[][] = null;

    export let NoobGuideStep = {
        "0": {
            rootPath: "Hall/HallUI",
            nodePaths: ["BottomNode/btn_StartGame"],
            guidePath:'BottomNode/btn_StartGame'
        },
        "1": {
            rootPath: "GameScene/GameUI",
            nodePaths: ["WordLayer",'idiomNode/maskNode/IdiomLayer'],
            guidePath:'idiomNode/maskNode/IdiomLayer'
        }
    }
}