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
        let listeners=['SendInviteShare'];
        this.register(listeners);
    }
    onDisable(){
        super.onDisable();
    }
    show(){
        
    }
    onClickInvite(event:cc.Button){
        let msg = new app.PB.message.GetInviteShare();
        msg.tag = 'invite';
        let pack = new PackageBase(Message.GetInviteShare);
        pack.d(msg).to(app.sever);
    }
    onClickVideo(event:cc.Button){

    }
    SendInviteShare(res){
        app.uiManager.showUI('InvitePanel',res.list);
    }
}