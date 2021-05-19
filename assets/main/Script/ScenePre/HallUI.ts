import { app } from '../app';
import BaseNode from '../base/BaseNode';
import ProgressAni from '../components/ProgressAni';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
import GameScene from '../SceneGame/GameScene';
import RoleUpgrade from './RoleUpgrade';
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

    @property(cc.Node)
    tiliIcon:cc.Node = null;
    @property(cc.Node)
    tiliGroove:cc.Node = null;

    onLoad () {
        super.onLoad();
        this.getComponent(cc.Widget).top = app.statusBarHeight;
        app.soundManager.playBackgroundMusic();
        this.level.string = app.levelData.currName;
        if (app.oldLevelData.length>0) {
            let data = app.oldLevelData[0];
            this.exp.initProgress(0,data.finalMaxExp);
        }else{
            this.exp.initProgress(0,app.levelData.finalMaxExp);
        }
        this.getComponentInChildren(RoleUpgrade).show(app.oldRoleData);
        this.tiliGroove.getChildByName('tili').active = false;
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
            this.getComponentInChildren(RoleUpgrade).show(app.oldRoleData,app.oldRoleData+1);
        }
    }
    refreshInfo(){
        if (app.userData.data) {
            this.lingshi.string = app.userData.data.stone;
            this.power.string = app.userData.data.tili;
        }
    }
    onClickStartGame(event:cc.Button){
        app.soundManager.playClick();
        if (!app.checkPointData) {
            app.uiManager.showUI('MessageNode','关卡信息获取失败！请重新登录！');
            return;
        }
        let StartGuanKa = new app.PB.message.StartGuanKa();
        StartGuanKa.tag = 'main';
        StartGuanKa.id = app.checkPointData.id;
        let pack = new PackageBase(Message.StartGuanKa);
        pack.d(StartGuanKa).to(app.sever);        
    }
    playStartAni(data){
        if (!data.first) {
            cc.director.loadScene('GameScene',()=>{
                console.log(cc.Canvas.instance);
                cc.Canvas.instance.getComponent(GameScene).BackStartGuanKa(data);
            });
            return;
        }
        let worldPos = this.tiliIcon.parent.convertToWorldSpaceAR(this.tiliIcon.position);
        let orignPos = this.tiliGroove.convertToNodeSpaceAR(worldPos);
        
        let nodeTili = this.tiliGroove.getChildByName('tili');
        nodeTili.active = false;
        cc.Tween.stopAllByTarget(nodeTili);
        cc.Tween.stopAllByTarget(this.power.node);
        
        cc.tween(this.power.node).blink(1,2).call(()=>{
            this.power.string = (app.userData.data.tili-1)+'';
            nodeTili.active = true;
            nodeTili.x = orignPos.x;
            nodeTili.y = orignPos.y-80;
            cc.tween(nodeTili).bezierTo(1,cc.v2(700, 0), cc.v2(100, -300), cc.v2(0,0)).call(()=>{
                cc.director.loadScene('GameScene',()=>{
                    console.log(cc.Canvas.instance);
                    cc.Canvas.instance.getComponent(GameScene).BackStartGuanKa(data);
                });
            }).start();
        }).start();
    }
    onClickSet(event:cc.Button){
        app.soundManager.playClick();
        app.uiManager.showUI('SetPanel');
    }
    onClickRank(event:cc.Button){
        app.soundManager.playClick();
        app.uiManager.showUI('RankPanel');
    }   
    
    onClickExchangeStone(event:cc.Button){
        app.soundManager.playClick();
        app.uiManager.showUI('StoneExchangePanel');
    }
    onClickAddPower(event:cc.Button){
        app.soundManager.playClick();
        app.uiManager.showUI('TiliPanel');
    }

}