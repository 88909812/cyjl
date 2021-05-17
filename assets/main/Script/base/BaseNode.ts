import { app } from "../app";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseNode extends cc.Component {
    private eventUIMap = cc.js.createMap();
    private eventTargetMap = cc.js.createMap();

    onLoad(){
        
    }

    onEnable() {
        this.eventTargetMap = {};
    }
    onDisable(){
        cc.Tween.stopAllByTarget(this.node);
        this.unscheduleAllCallbacks();
        for (const eventTarget in this.eventTargetMap) {
            const eventUINames = this.eventTargetMap[eventTarget];
            for (let index = 0; index < eventUINames.length; index++) {
                const eventName = eventUINames[index];
                app[eventTarget].off(eventName, this.eventUIMap[eventName]);
                delete this.eventUIMap[eventName];
            }
            delete this.eventTargetMap[eventTarget];
        }
        

        app.sever.unregisterHandlers(this);
    }
    hide(){
        this.node.active = false;
    }
    onClickClose(){
        app.soundManager.playClick();
        this.hide();
    }

    onEventUI(eventName: string, listener: Function, eventTarget: string = 'uiViewEvent') {
        if (!listener) {
            cc.error('不存在监听函数：' + eventName);
            return;
        }
        app[eventTarget].on(eventName, listener);
        this.eventUIMap[eventName] = listener;
        if(!this.eventTargetMap[eventTarget]){
            this.eventTargetMap[eventTarget] = [];
        }
        this.eventTargetMap[eventTarget].push(eventName);
    }
    /**注册当前脚本上的所有监听事件(请在onEnable时调用)
     * 例：this.register(['onEnterMatchRsp']);
     * @param listeners 监听的函数数组,**注意！函数名必须和消息同名**
     */
    register(listeners:Array<string>){
        app.sever.registerHandlers(this,listeners);
    }
}
