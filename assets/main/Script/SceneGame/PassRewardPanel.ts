import { app } from '../app';
import BasePanel from '../base/BasePanel';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class PassRewardPanel extends BasePanel {
    @property(cc.Label)
    rewardLab:cc.Label = null;

    identifier = '';
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
    show(num = 0,identifier){
        this.rewardLab.string = '+'+num;
        this.identifier = identifier;
    }
    onClickGet(event:cc.Button){
        let GetGuanKaAward = new app.PB.message.GetGuanKaAward();
        GetGuanKaAward.identifier = this.identifier;
        let pack = new PackageBase(Message.GetGuanKaAward);
        pack.d(GetGuanKaAward).to(app.sever);

        this.onClickClose();
    }
    onClickVideo(event:cc.Button){
        

        this.onClickClose();
    }
}