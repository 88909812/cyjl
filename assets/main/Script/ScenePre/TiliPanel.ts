import { app } from '../app';
import BasePanel from '../base/BasePanel';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class TiliPanel extends BasePanel {
    onLoad () {
        super.onLoad();
    }
    onClickCurtain(){
        this.onClickClose();
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }
    show(){
        
    }
    onClickInvite(event:cc.Button){
        app.uiManager.showUI('InvitePanel');
    }
    onClickVideo(event:cc.Button){

    }
}