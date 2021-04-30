import BasePanel from '../base/BasePanel';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class SetPanel extends BasePanel {
    onLoad () {
        super.onLoad();
    }
    onClickCurtain(){
        //cc.log('如果需要添加点击幕布时的操作，你可以选择重载onClickCurtain');
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }
    show(){
        
    }
    onCheckOffOn(event:cc.Toggle){
        let node = event.node.getChildByName('select');
        let posX = event.isChecked?-45:45;
        cc.tween(node).to(0.1, { x: posX }).start();
    }
}