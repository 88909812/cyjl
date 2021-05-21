import { app } from '../app';
import BasePanel from '../base/BasePanel';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
import GameScene from '../SceneGame/GameScene';
import HallUI from './HallUI';
const {ccclass, property} = cc._decorator;
@ccclass
export default class DailyTipPanel extends BasePanel {
    @property(cc.Node)
    tiliGroove:cc.Node = null;
    @property(cc.Node)
    btnStartNode:cc.Node = null;
    isAnimationPlayed = false;
    onLoad () {
        super.onLoad();
    }
    onClickCurtain(){
        //cc.log('如果需要添加点击幕布时的操作，你可以选择重载onClickCurtain');
    }
    onEnable() {
        super.onEnable();
        this.onEventUI('CheckPointInit',(tag,id)=>{
            let StartGuanKa = new app.PB.message.StartGuanKa();
            StartGuanKa.tag = tag;
            StartGuanKa.id = id;
            let pack = new PackageBase(Message.StartGuanKa);
            pack.d(StartGuanKa).to(app.sever);
        });
        this.onEventUI('StartDailyGame',(res)=>{
            this.playStartAni(res);
        });
    }
    onDisable(){
        super.onDisable();
    }
    show(){
        this.isAnimationPlayed = false;
        let lab = this.btnStartNode.getComponentInChildren(cc.Label);
        if (app.userData.lastGuanKa.dayComplete) {
            lab.string = '今日已完成';
            lab.node.x = 0;
            this.btnStartNode.getChildByName('xiaohao').active = false;
        } else {
            lab.string = '开始游戏';
            lab.node.x = -10;
            this.btnStartNode.getChildByName('xiaohao').active = true;
        }
    }
    onClickStartGame(event:cc.Button){
        if (this.isAnimationPlayed) {
            return;
        }
        if (app.userData.lastGuanKa.dayComplete) {
            app.uiManager.showUI('MessageNode','恭喜少侠破解今日难关，恳请明日再来帮助老夫答疑解惑！');
            return;
        }
        app.uiBaseEvent.emit('reqGuanKaInfo','day');
        this.isAnimationPlayed = true;
    }
    playStartAni(data){
        if (!data.first) {
            cc.director.loadScene('GameScene',()=>{
                console.log(cc.Canvas.instance);
                cc.Canvas.instance.getComponent(GameScene).BackStartGuanKa(data);
            });
            return;
        }
        let tiliIcon = cc.Canvas.instance.getComponentInChildren(HallUI).tiliIcon;
        let powerLabel = cc.Canvas.instance.getComponentInChildren(HallUI).power;
        let worldPos = tiliIcon.parent.convertToWorldSpaceAR(tiliIcon.position);
        let orignPos = this.tiliGroove.convertToNodeSpaceAR(worldPos);
        
        let nodeTili = this.tiliGroove.getChildByName('tili');
        nodeTili.active = false;
        cc.Tween.stopAllByTarget(nodeTili);
        cc.Tween.stopAllByTarget(powerLabel.node);
        
        cc.tween(powerLabel.node).blink(1,2).call(()=>{
            powerLabel.string = app.userData.data.tili+'';
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
}