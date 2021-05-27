import BasePanel from '../base/BasePanel';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewPlayerPanel extends BasePanel {
    onLoad () {
        super.onLoad();
    }
    onClickCurtain(){
        this.onClickClose();
        cc.director.loadScene('Hall');
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }
    show(){
        
    }
}