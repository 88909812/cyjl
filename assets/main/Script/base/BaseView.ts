import { app } from '../app';
import BaseNode from './BaseNode';
const {ccclass, property} = cc._decorator;
const MoveX = 800;
@ccclass
export default class BaseView extends BaseNode {
    
    // LIFE-CYCLE CALLBACKS:
    

    onLoad () {
        super.onLoad();

        this.getComponent(cc.Widget).top = app.statusBarHeight;

        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = this.name.substring(this.name.indexOf('<') + 1, this.name.indexOf('>'));
        eventHandler.handler = 'onClickBackground' // 绑定回调方法名称
        let btnCutain = this.node.addComponent(cc.Button);
        btnCutain.clickEvents.push(eventHandler);
    }
    onClickBackground(){
        //屏蔽向下触摸，防止事件穿透
    }

    onClickClose(){
        cc.tween(this.node)
            .to(0.1, { x: -MoveX })
            .call(() => {
                super.onClickClose();
            })
            .start();
    }

    onEnable() {
        super.onEnable();
        cc.tween(this.node)
            .set({ x: -MoveX })
            .to(0.2, { x: 0 })
            .start();
    }
    onDisable(){
        super.onDisable();
        
    }
    
    // update (dt) {}
}
