import {DESIGN_HEIGHT,DESIGN_WIDTH} from '../GameDefine';
import BaseNode from '../base/BaseNode';
const {ccclass, property} = cc._decorator;

@ccclass
export default class AdapterBackground extends BaseNode {
    onLoad () {
        super.onLoad();
        let frameSize = cc.view.getFrameSize();
        let nodeScale = (frameSize.height/frameSize.width)/(DESIGN_WIDTH/DESIGN_HEIGHT);
        cc.log('nodeScale===',nodeScale);
        if (nodeScale > 1) {
            this.node.scale = Number(nodeScale.toFixed(2));
        }
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }
}