import BasePanel from './base/BasePanel';
import { Message } from "./net/NetDefine";
import { PackageBase } from "./net/PackageBase";
const {ccclass, property} = cc._decorator;

@ccclass
export default class AdministratorPanel extends BasePanel {

    goldAdd = 0;
    diamondAdd = 0;
    moneyAdd = 0;
    ticketAdd = 0;
    checkpointAdd = 0;
    levelAdd = 0;
    bullLevel = 1;
    // onLoad () {}

    show () {

    }

    onClickCurtain(){
        this.onClickClose();
    }
    onChangeAddGold(str:string){
        this.goldAdd = Number(str);
    }
    onChangeAddDiamond(str:string){
        this.diamondAdd = Number(str);
    }
    onChangeAddMoney(str:string){
        this.moneyAdd = Number(str);
    }
    onChangeAddTicket(str:string,editbox:cc.EditBox){
        this.ticketAdd = Number(str);
    }
    onChangeCheckPoint(str:string){
        this.checkpointAdd = Number(str);
    }
    onChangeLevel(str:string){
        this.levelAdd = Number(str);
    }

    // update (dt) {}
}
