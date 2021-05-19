import { app } from "../app";
import { Message } from "../net/NetDefine";
import { PackageBase } from "../net/PackageBase";

enum AdType{
    FullVideo = 0,
    RewardVideo
}
const packageName = 'com/duqu/niu/';
export default class PlatformManager {
    private static instance: PlatformManager;
    private debugModel = -1;
    public isLoadBanner = false;

    private constructor() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.onShow((res)=>{
                console.log('onShow===',res);
                wx.setKeepScreenOn({ keepScreenOn: true });
            });
            wx.showShareMenu();
        }
    }
    
	static getIns(): PlatformManager {
		if(!PlatformManager.instance) {
			PlatformManager.instance = new PlatformManager();
		}
		return PlatformManager.instance;
    }
    gameInitComplete(){
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod(packageName+"AppActivity", "onGameInitComplete","()V");
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            jsb.reflection.callStaticMethod("AppController","onGameInitComplete");
        }
    }
    setKeepScreenOn(){
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.setKeepScreenOn({ keepScreenOn: true });
        }else if (cc.sys.isNative) {
            jsb.Device.setKeepScreenOn(true);
        }
    }

    setClipboardData(str){
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.setClipboardData({
                data: str,
                success(res){}
            });
        }else if (cc.sys.isNative) {
            if (cc.sys.platform == cc.sys.ANDROID) {
                jsb.reflection.callStaticMethod(packageName+"AppActivity", "setClipboardData","(Ljava/lang/String;)V",str);
            }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
                jsb.reflection.callStaticMethod("AppController","setClipboardData:",str);
            }
        }
    }

    getClipboardData():string{
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            new Promise((resolve, reject) => {
                wx.getClipboardData({
                    success(res) {
                        resolve(res.data);
                    },
                    fail(err) {
                        reject(err)
                    }
                });
            }).then(res => {
                return res;
            }, err => {
                return '';
            });
        }else if (cc.sys.platform == cc.sys.ANDROID){
            return jsb.reflection.callStaticMethod(packageName+"AppActivity", "getClipboardData","()Ljava/lang/String;");
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            return jsb.reflection.callStaticMethod("AppController","getClipboardData");
        }
        return '';
    }

    getStatusBarHeight():number{
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            return wx.getSystemInfoSync().statusBarHeight;
        }else if (cc.sys.platform == cc.sys.ANDROID){
            return jsb.reflection.callStaticMethod(packageName+"AppActivity", "getStatusBarHeight","()I");
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            return jsb.reflection.callStaticMethod("AppController","getStatusBarHeight");
        }
        return 0;
    }

    getIMEI(): string {
        let imei = '';
        if (cc.sys.platform == cc.sys.ANDROID) {
            imei = jsb.reflection.callStaticMethod(packageName+"AppActivity", "getIMEI","()Ljava/lang/String;");
            if (imei == '') {
                app.uiManager.showUI('MessageNode','获取不到设备唯一码，请开启相关权限！');
            }
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            imei = jsb.reflection.callStaticMethod("AppController","getIDFA");
            if (imei == '') {
                app.uiManager.showUI('MessageNode','请关闭 “设置->隐私->广告->限制广告跟踪”，再重启app登录！');
            }
        }else{
            imei = '';
        }
        return imei;
    }
    getPhoneType():string{
        let phoneType = '';
        if (cc.sys.platform == cc.sys.ANDROID) {
            phoneType = jsb.reflection.callStaticMethod(packageName+"AppActivity", "getPhoneType","()Ljava/lang/String;");
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            phoneType = jsb.reflection.callStaticMethod("AppController","getPhoneType");
        }
        return phoneType;
    }
    getInjection():string{
        let injection = '';
        if (cc.sys.platform == cc.sys.ANDROID) {
            injection = jsb.reflection.callStaticMethod(packageName+"AppActivity", "getInjection","()Ljava/lang/String;");
        }
        return injection;
    }

    downloadApk(downloadUrl){
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod(packageName + "AppActivity", "downloadApk", "(Ljava/lang/String;)V", downloadUrl);
        } else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
        }
    }
    isDebug() {
        if (this.debugModel === -1) {
            let bool;
            if (cc.sys.platform == cc.sys.ANDROID) {
                bool = jsb.reflection.callStaticMethod(packageName+"AppActivity", "isDebug","()Z");
            }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
                bool = jsb.reflection.callStaticMethod("AppController","isDebug");
            }else{
                bool = true;
            }
            cc.log('isDebug=', bool);
            if (!bool) {
                this.debugModel = 0;
            } else {
                this.debugModel = 1;
            }
        }
        let isDebug = this.debugModel == 1;
        return isDebug;
    }

    getWechatAppID():string{
        let appID = 'wx4d78ecaf417ca15b';
        if (cc.sys.platform == cc.sys.ANDROID) {
            appID = jsb.reflection.callStaticMethod(packageName+"AppActivity", "getWechatAppID","()Ljava/lang/String;");
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            appID = jsb.reflection.callStaticMethod("AppController","getWechatAppID");
        }
        return appID;
    }
    isWxInstalled():boolean{
        let bool = false;
        if (cc.sys.platform == cc.sys.ANDROID) {
            bool = jsb.reflection.callStaticMethod(packageName+"AppActivity", "isWXAppInstalled","()Z");
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            bool = jsb.reflection.callStaticMethod("AppController","isWXAppInstalled");
        }
        return bool;
    }
    WXSendAuth(){
        if (!this.isWxInstalled()&&cc.sys.isNative) {
            app.uiManager.showUI('MessageNode','请先安装微信');
            return;
        }
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod(packageName+"AppActivity", "WXSendAuth","()V");
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            jsb.reflection.callStaticMethod("AppController","WXSendAuth");
        }
    }
    
    WXShare(shareType = 0, url = '', title = '', content = '') {        
        if (CC_PREVIEW||cc.sys.isBrowser) {
            app.uiViewEvent.emit('WXShareCallBack');
            return;
        }
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod(packageName + "AppActivity", "WXShare", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", shareType, url, title, content);
        } else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            jsb.reflection.callStaticMethod("AppController", "WXShare:url:title:content:", shareType, url, title, content);
        }
    }
    getUmengDeviceToken():string{
        let deviceToken = '';
        if (cc.sys.platform == cc.sys.ANDROID) {
            deviceToken = jsb.reflection.callStaticMethod(packageName + "AppActivity", "getUmengDeviceToken", "()Ljava/lang/String;");
        } else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            deviceToken = jsb.reflection.callStaticMethod("AppController", "getUmengDeviceToken");
        }
        return deviceToken;
    }
    isAliPayInstalled(){
        let bool = false;
        if (cc.sys.platform == cc.sys.ANDROID) {
            bool = jsb.reflection.callStaticMethod(packageName+"AppActivity", "isAliPayInstalled","()Z");
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            bool = jsb.reflection.callStaticMethod("AppController","isAliPayInstalled");
        }
        return bool;
    }
    //************广告相关**************** */
    loadFullScreenVideoAd(){
        if (CC_PREVIEW||cc.sys.isBrowser) {
            return;
        }
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod(packageName+"AppActivity", "loadFullScreenVideoAd","()V");
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            jsb.reflection.callStaticMethod("AppController","loadFullScreenAd");
        }
    }
    playFullScreenVideoAd(){
        if (CC_PREVIEW||cc.sys.isBrowser) {
            app.uiViewEvent.emit('onVideoAdFinish',AdType.FullVideo);
            return;
        }
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod(packageName+"AppActivity", "playFullScreenVideoAd","()V");
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            jsb.reflection.callStaticMethod("AppController","playFullScreenAd");
        }
    }
    
    loadRewardVideoAd(){
        if (CC_PREVIEW||cc.sys.isBrowser) {
            return;
        }
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod(packageName+"AppActivity", "loadRewardVideoAd","()V");
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            jsb.reflection.callStaticMethod("AppController","loadRewardVideoAd");
        }
    }
    playRewardVideoAd(){
        if (CC_PREVIEW||cc.sys.isBrowser) {
            app.uiViewEvent.emit('onVideoAdFinish',AdType.RewardVideo);
            return;
        }
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod(packageName+"AppActivity", "playRewardVideoAd","()V");
        }else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            jsb.reflection.callStaticMethod("AppController","playRewardVideoAd");
        }
    }
    playSplashAd(){
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod(packageName + "AppActivity", "ShowSplashAd", "()V");
        } else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            //TODO
        }
    }
    //setY<0 默认使用置底
    playBannerAd(delay = 0,setY = -1){
        var height=cc.view.getFrameSize().height;
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod(packageName + "AppActivity", "ShowBannerAd", "(III)V",delay,setY,height);
        } else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            //TODO
        }
    }
    hideBannerAd(){
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod(packageName + "AppActivity", "HideBannerAd", "()V");
        } else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
            //TODO
        }
    }
    updateUserInfo(){
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.getSetting({
                success:(res)=> {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        wx.getUserInfo({
                            success: (res)=> {
                                console.log(res);
                                let userData = res.userInfo;
                                if (userData) {
                                    this.uploadUserInfo(userData);
                                }
                            }
                        })
                    }
                }
            });
        }
    }
    initAuthButton(){
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.getSetting({
                success:(res)=> {
                    console.log('getSetting--',res);
                    if (!res.authSetting['scope.userInfo']) {// 已经授权可以直接调用 getUserInfo 获取头像昵称
                        let btnSize = cc.winSize;
                        let ratio = 1;
                        let width = btnSize.width *ratio;
                        let height = btnSize.height*ratio;
    
                        let btnAuthorize = wx.createUserInfoButton({
                            type: 'text',
                            text: '',
                            style: {
                                left: 0,
                                top: 0,
                                width: width,
                                height: height,
                                backgroundColor: ''
                            }
                        });
                        btnAuthorize.onTap((res) => {
                            console.log('getUserInfo===', res);
                            let userData = res.userInfo;
                            if (userData) {
                                btnAuthorize.destroy();
                                this.uploadUserInfo(userData);
                            }
                        });
                    }
                }
            });
        }
    }
    private uploadUserInfo(userData) {
        let msg = new app.PB.message.SendMPUserInfo();
        msg.name = userData.nickName;
        msg.avatar = userData.avatarUrl;
        msg.sex = userData.gender;
        let pack = new PackageBase(Message.SendMPUserInfo);
        pack.d(msg).to(app.sever);
    }
    //****** java调用js ******** */
    onFullVideoAdError(){
        cc.log('广告载入失败');
        this.loadFullScreenVideoAd();
    }
    onFullVideoAdCached(){
        cc.log('广告缓存成功');
    }
    onFullVideoAdFinish(){
        cc.log('广告播放完成');
        setTimeout(()=>{
            app.uiViewEvent.emit('onVideoAdFinish',AdType.FullVideo);
        },100);
        
        //播放完后直接加载，下次调用就直接play就行了
        this.loadFullScreenVideoAd();
    }

    onRewardVideoAdError(){
        cc.log('广告载入失败');
        this.loadRewardVideoAd();
    }
    onRewardVideoAdCached(){
        cc.log('广告缓存成功');
    }
    onRewardVideoAdFinish(){
        cc.log('广告播放完成');
        setTimeout(()=>{
            app.uiViewEvent.emit('onVideoAdFinish',AdType.RewardVideo);
        },100);
        //播放完后直接加载，下次调用就直接play就行了
        this.loadRewardVideoAd();
    }
    onBannerAdCallBack(code:string){
        //1:Loaded  2:Failed  3:Clicked  4:Show  5:Close
        if(code == "1"){
            this.isLoadBanner = true;
        }
    }



    //****** java调用js ******** */
    onDownloadProgress(progress){
        console.log('onDownloadProgress---',progress);
        app.uiViewEvent.emit('onDownloadProgress',progress);
    }
    WXSendAuthCallBack(str){
        console.log('WXSendAuthCallBack',str);
        let paramArr = str.split('&');
        let params: { [x: string]: any } = {};
        paramArr.forEach(function (param) {
            var paramSplit = param.split('=');
            params[paramSplit[0]] = paramSplit[1];
        });
        app.uiViewEvent.emit('WXSendAuthCallBack',Number(params.errCode),params.code);

    }
    WXShareCallBack(){
        console.log('WXShareCallBack!!!');
        app.uiViewEvent.emit('WXShareCallBack');
    }

    onKeyBack(){
        app.uiManager.showUI('TipPanel','确定要退出游戏吗?',()=>{
            cc.game.end();
        });
    }
    onPause(){
        console.log('onPause!!!');
    }
    onResume(){
        app.uiBaseEvent.emit('onResume');
        console.log('onResume!!!');
    }
    onShow(str){
        console.log('onShow=',str);

        // if (!str||str == '') {
        //     return;
        // }
        // let paramArr = str.split('&');
        // let params: { [x: string]: any } = {};
        // paramArr.forEach(function (param) {
        //     var paramSplit = param.split('=');
        //     if (paramSplit.length >= 2) {//确定是自己要的数据格式
        //         params[paramSplit[0]] = paramSplit[1];
        //     }
        // });
    }
}