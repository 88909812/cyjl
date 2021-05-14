import { app } from "../app";

const {ccclass, property} = cc._decorator;
const ConfigProgress = 0.1;
const ImgProgress = 0.3;
const SoundProgress = 1;
const PfbProgress = 1;
@ccclass
export default class LoadingScene extends cc.Component {
    @property(cc.ProgressBar)
    progressbar: cc.ProgressBar = null;
    @property(cc.Label)
    tipLabel:cc.Label = null;
    start () {
        let phoneType = app.platform.getPhoneType();
        console.log('phoneType---',phoneType,cc.sys.os+cc.sys.osVersion);
        if(this.tipLabel)this.tipLabel.string = '游戏初始化中...';
    }

    onEnable(){
        this.loadConfig();
    }
    loadConfig(){
        cc.resources.loadDir('configs',cc.JsonAsset, (completedCount, totalCount, item) => {
            let progress = Number((ConfigProgress + (completedCount / totalCount) * (ImgProgress - ConfigProgress)).toFixed(2));
            if(this.tipLabel)this.tipLabel.string = '配置加载中：' + progress * 100 + '%';
            if(this.progressbar)this.progressbar.progress = progress;
        }, (err, objects) => {
            if (err) {cc.error('LoadingScene::loadConfig error', err);}
            objects.forEach((object:cc.JsonAsset) => {
                app[object.name] = object.json;
            });
            this.loadImg();
        });
    }
    loadImg(){
        cc.resources.loadDir('images',cc.SpriteFrame, (completedCount, totalCount, item) => {
            let progress = Number((ConfigProgress + (completedCount / totalCount) * (ImgProgress - ConfigProgress)).toFixed(2));
            if(this.tipLabel)this.tipLabel.string = '图片加载中：' + progress * 100 + '%';
            if(this.progressbar)this.progressbar.progress = progress;
        }, (err, objects) => {
            if (err) {cc.error('LoadingScene::img error', err);}
            this.loadSound();
        });
    }
    loadSound(){
        cc.resources.loadDir('sounds',cc.AudioClip, (completedCount, totalCount, item) => {
            let progress = Number((ImgProgress + (completedCount / totalCount) * (SoundProgress - ImgProgress)).toFixed(2));
            if(this.tipLabel)this.tipLabel.string = '音乐加载中：' + progress * 100 + '%';
            if(this.progressbar)this.progressbar.progress = progress;
        }, (err, objects) => {
            if (err) {cc.error('LoadingScene::img error', err);}
            this.loadPfb();
        });
    }
    loadPfb(){
        cc.resources.loadDir('prefabs',cc.Prefab, (completedCount, totalCount, item) => {
            let progress = Number((SoundProgress + (completedCount / totalCount) * (PfbProgress - SoundProgress)).toFixed(2));
            if (progress>PfbProgress) {
                if(this.tipLabel)this.tipLabel.string = '加载资源中：' + Math.ceil(progress * 100) + '%';
                if(this.progressbar)this.progressbar.progress = progress;
            }
        }, (err, objects) => {
            if (err) {cc.error('LoadingScene::img error', err);}
            if(this.tipLabel)this.tipLabel.string = '连接服务器中...';
            app.uiBaseEvent.emit('NetInit');
        });
    }
    // update (dt) {}
}

