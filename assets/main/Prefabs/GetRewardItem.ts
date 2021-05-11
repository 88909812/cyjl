import BaseNode from "../Script/base/BaseNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GetRewardItem extends BaseNode {
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    labCount: cc.Label = null;

    init(name, count = '1') {
        let resPath = 'props/'+name;
        this.labCount.string = 'X'+count;
        cc.resources.load(resPath, cc.SpriteFrame, (err, spriteframe:cc.SpriteFrame) => {
            if (!err) {
                this.icon.spriteFrame = spriteframe;
            }
        });
    }



    // update (dt) {}
}
