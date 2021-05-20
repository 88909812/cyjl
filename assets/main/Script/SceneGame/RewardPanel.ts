import { app } from '../app';
import BasePanel from '../base/BasePanel';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class RewardPanel extends BasePanel {
    @property(cc.Label)
    rewardLab:cc.Label = null;
    @property(cc.Sprite)
    rewardIcon:cc.Sprite = null;

    @property(cc.Label)
    title:cc.Label = null;

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
    show(name,count:number|string,identifier){
        if (typeof(count) == 'number') {
            this.rewardLab.string = this.getDesByIconName(name)+count;
        }else{
            this.rewardLab.string = count;
        }
        
        let resPath = 'props/'+name+'_big';
        cc.resources.load(resPath, cc.SpriteFrame, (err, spriteframe:cc.SpriteFrame) => {
            if (!err) {
                this.rewardIcon.spriteFrame = spriteframe;
            }
        });

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

    getDesByIconName(name){
        switch(name){
            case 'tili':return '体力+';
            case 'stone':return '灵石+';
            case 'exp':return '修为+';
            default :return '';
        }
    }
}