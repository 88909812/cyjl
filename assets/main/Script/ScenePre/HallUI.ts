import { app } from '../app';
import BaseNode from '../base/BaseNode';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class HallUI extends BaseNode {
    @property(cc.Label)
    power:cc.Label = null;
    @property(cc.Label)
    lingshi:cc.Label = null;

    @property(cc.Label)
    level:cc.Label = null;
    @property(cc.ProgressBar)
    exp:cc.ProgressBar = null;

    onLoad () {
        super.onLoad();
        this.level.string = app.levelData.currName;
        this.exp.progress = app.levelData.finalExp/app.levelData.finalMaxExp;
        
        this.refreshInfo();
    }
    onEnable() {
        super.onEnable();
        this.onEventUI('UpdateLevelInfo',()=>{
            this.level.string = app.levelData.currName;
            this.exp.progress = app.levelData.finalExp/app.levelData.finalMaxExp;
        });
        this.onEventUI('UpdateUserInfo',()=>{
            this.refreshInfo();
        });
    }
    onDisable(){
        super.onDisable();
    }
    refreshInfo(){
        if (app.userData.data) {
            this.lingshi.string = app.userData.data.stone;
            this.power.string = app.userData.data.tili;
        }
    }
    onClickStartGame(event:cc.Button){
        if (!app.checkPointData) {
            app.uiManager.showUI('MessageNode','关卡信息获取失败！请重新登录！');
            return;
        }
        cc.director.loadScene('GameScene');
    }
    
    onClickSet(event:cc.Button){
        app.uiManager.showUI('SetPanel');
    }
    onClickRank(event:cc.Button){

    }
    
    onClickAddLingshi(event:cc.Button){

    }
    onClickAddPower(event:cc.Button){
        
    }
}