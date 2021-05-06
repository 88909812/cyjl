import { app } from '../app';
import BasePanel from '../base/BasePanel';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class SetPanel extends BasePanel {
    @property(cc.Toggle)
    toggleMusic:cc.Toggle=null;
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
        cc.sys.localStorage.setItem('idomUserConfig', JSON.stringify(app.userConfig));
    }
    show(){
        let bool = app.soundManager.getMusicSwitch();
        this.toggleMusic.isChecked = bool;
        let node = this.toggleMusic.node.getChildByName('select');
        let posX = bool?-45:45;
        node.x = posX;
    }
    onCheckOffOn(event:cc.Toggle){
        let node = event.node.getChildByName('select');
        let posX = event.isChecked?-45:45;
        cc.tween(node).to(0.1, { x: posX }).start();

        app.soundManager.setMusicSwitch(event.isChecked);
    }
}