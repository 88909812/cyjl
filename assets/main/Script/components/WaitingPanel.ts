import { app } from '../app';
import BasePanel from '../base/BasePanel';
const ProcessTime = 0.5;
const {ccclass, property} = cc._decorator;

@ccclass
export default class WaitingPanel extends BasePanel {
    callFun: Function = null;
    loadNode:cc.Node = null;

    curWaitTime = 0;
    onLoad () {
        super.onLoad();
        cc.game.addPersistRootNode(this.node);
        this.node.zIndex = 1000;
        app.waitingPanel = this;
        this.node.active = false;
        this.loadNode = cc.find('UINode/jz_icon',this.node);
    }

    show(delayTime: number = 5, callfun:Function = null){
        this.curWaitTime = 0;
        if (this.loadNode) {
            this.loadNode.parent.active = false;
        }
        this.node.getChildByName('Cutain').opacity = 0;
        this.node.active = true;
        this.callFun = callfun;

        let showAniTime = 1;
        cc.tween(this.node).delay(showAniTime).call(() => {
            if (this.loadNode) this.loadNode.parent.active = true;
        }).delay(delayTime > 1 ? delayTime - showAniTime : 0).call(() => {
            if (this.callFun) {
                this.callFun();
            }
            this.hide();
        }).start();
    }

    update (dt) {
        if (this.node.active && this.loadNode) {
            this.curWaitTime+=dt;
            if (this.curWaitTime > ProcessTime) {
                this.loadNode.parent.active = true;
                this.loadNode.angle-=15;
                if (this.loadNode.angle <= -360) {
                    this.loadNode.angle += 360;
                }
            }
        }
    }
}
