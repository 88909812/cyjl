import { app } from '../app';
import BaseNode from '../base/BaseNode';
import ProgressAni from '../components/ProgressAni';
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
    @property(ProgressAni)
    exp:ProgressAni = null;

    onLoad () {
        super.onLoad();
        this.level.string = app.levelData.currName;
        if (app.oldLevelData.length>0) {
            let data = app.oldLevelData[0];
            this.exp.initProgress(0,data.finalMaxExp);
        }else{
            this.exp.initProgress(0,app.levelData.finalMaxExp);
        }
        
        app.uiManager.showUI('RoleUpgrade',app.oldRoleData);
        this.refreshInfo();
        this.checkUpLevel();
    }
    onEnable() {
        super.onEnable();
        this.onEventUI('UpdateLevelInfo',()=>{
            this.checkUpLevel();
        });
        this.onEventUI('UpdateUserInfo',()=>{
            this.refreshInfo();
        });
        this.onEventUI('RoleUpgradeFinish',()=>{
            this.checkUpLevel();
        });
    }
    onDisable(){
        super.onDisable();
    }
    checkUpLevel(){
        if (app.oldLevelData.length>0) {
            this.exp.progressTo(1,()=>{
                let levelData = app.oldLevelData.shift();

                this.level.string = levelData.currName;
                cc.Tween.stopAllByTarget(this.level.node);
                cc.tween(this.level.node).blink(1,3).call(()=>{
                    if (levelData.biglvlup) {
                        this.checkUpRole();
                    } else {
                        this.checkUpLevel();
                    }
                }).start();
                this.exp.initProgress(0,levelData.finalMaxExp);
            });
        }else{
            this.exp.progressTo(app.levelData.finalExp/app.levelData.finalMaxExp);
        }
    }
    checkUpRole(){
        let nowRoleData = Math.ceil(app.userData.data.lvl)
        if (app.oldRoleData < nowRoleData) {
            app.uiManager.showUI('RoleUpgrade',app.oldRoleData,app.oldRoleData+1);
        }
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
        app.uiManager.showUI('RankPanel');
    }   
    
    onClickExchangeStone(event:cc.Button){
        app.uiManager.showUI('StoneExchangePanel');
    }
    onClickAddPower(event:cc.Button){
        app.uiManager.showUI('TiliPanel');
    }
}