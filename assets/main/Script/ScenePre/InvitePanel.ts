import HeadNode from '../../Prefabs/HeadNode';
import BasePanel from '../base/BasePanel';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class InvitePanel extends BasePanel {
    @property([HeadNode])
    avatars:HeadNode[]= [];
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
    hide(){
        this.node.destroy();
    }
    show(invites){
        for (let index = 0; index < invites.length; index++) {
            const invite = invites[index];
            this.avatars[index].init(invite.avatar);
            this.avatars[index].node.getChildByName('btn_Invite').active = false;
        }
    }
    onClickInvite(event:cc.Button){
        
    }

}