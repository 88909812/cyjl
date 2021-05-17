import { app } from '../app';
import BaseNode from './BaseNode';
const {ccclass, property} = cc._decorator;

@ccclass
export default class BasePanel extends BaseNode {
    
    // LIFE-CYCLE CALLBACKS:
    originalScale = 0;
    UINode:cc.Node = null;

    onLoad () {
        super.onLoad();
        this.UINode = this.node.getChildByName('UINode');
        if (!this.UINode) {
            cc.error(this.node.name+'缺少节点：UINode');
            return;
        }

        let cutain = new cc.Node('Cutain');
        cutain.width = 750;
        cutain.height = 2000;
        cutain.parent = this.node;
        cutain.zIndex = -1;
        cutain.color = cc.color(0,0,0);
        cutain.opacity = 180;

        let spCutain = cutain.addComponent(cc.Sprite);
        spCutain.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        cc.resources.load('images/singleColor',cc.SpriteFrame,  (err, frame:cc.SpriteFrame)=> {
            spCutain.spriteFrame = frame;
        });
        
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = this.name.substring(this.name.indexOf('<') + 1, this.name.indexOf('>'));
        eventHandler.handler = 'onClickCurtain' // 绑定回调方法名称
        let btnCutain = cutain.addComponent(cc.Button);
        btnCutain.clickEvents.push(eventHandler);

        this.originalScale = this.UINode.scale;
    }
    onClickCurtain(){
        //cc.log('如果需要添加点击幕布时的操作，你可以选择重载onClickCurtain');
    }
    onClickClose() {
        cc.tween(this.UINode).to(0.1, { scale: 0 })
            .call(() => {
                super.onClickClose();
            })
            .start();
    }
    //***********可以重载这个函数，来达到改变进入动画的目的*********
    enableAnimation(){
        cc.tween(this.UINode).set({ scale: 0 }).to(0.2, { scale: this.originalScale }, { easing: 'backOut' }).start();
    }
    //**************************************************** */
    onEnable() {
        super.onEnable();
        this.enableAnimation();
    }
    onDisable(){
        super.onDisable();
    }
    
    // update (dt) {}
}
