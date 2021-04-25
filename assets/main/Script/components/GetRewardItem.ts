import BaseNode from '../base/BaseNode';
const {ccclass, property} = cc._decorator;

@ccclass
export default class GetReward extends BaseNode {
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    labCount: cc.Label = null;

    init(id, count = '1') {
        let resPath = '';
        if (id < 10) {//金币
            resPath = 'props/prop_gold';
        } else if (id >= 10 && id < 20) {//钻石
            resPath = 'props/prop_diamond';
        } else if (id >= 30 && id < 40) {//人民币
            resPath = 'props/prop_rmb';
        } else if (id >= 100) {//道具
            resPath = 'props/prop_'+id;
        }

        this.labCount.string = '+'+count;
        cc.resources.load(resPath, cc.SpriteFrame, (err, spriteframe:cc.SpriteFrame) => {
            if (!err) {
                this.icon.spriteFrame = spriteframe;
            }
        });
    }



    // update (dt) {}
}
