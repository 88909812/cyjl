import BaseNode from '../base/BaseNode';
import { PackageBase } from "../net/PackageBase";
import { Message } from "../net/NetDefine";
import { app } from '../app';
import MaskEx from '../components/MaskEx';
const {ccclass, property} = cc._decorator;

@ccclass
export default class NoobGuide extends BaseNode {
    @property(cc.Node)
    tipHand: cc.Node = null;

    @property(MaskEx)
    mask: MaskEx = null;

    onLoad () {
        super.onLoad();
        this.tipHand.on('touchend',this.touchEnd,this);
        this.tipHand.on('touchcancel', this.touchEnd,this);
        this.tipHand['_touchListener'].setSwallowTouches(false);
    }
    onDisable(){
        super.onDisable();
        cc.Tween.stopAllByTarget(this.tipHand.children[0]);
    }

    show(guide,rootNode){
        this.node.active = true;
        this.reset();

        let rects:cc.Rect[] = [];
        for (let index = 0; index < guide.nodePaths.length; index++) {
            const nodePath = guide.nodePaths[index];
            let showNode:cc.Node = cc.find(nodePath,rootNode);
            if (!showNode || !showNode.active) {
                break;
            }
            let nodePoint = this.mask.node.convertToNodeSpaceAR(showNode.convertToWorldSpaceAR(cc.v2(0,0)));
            rects.push(cc.rect(nodePoint.x,nodePoint.y,showNode.width,showNode.height));
        }
        this.mask.init(rects);


        let guideNode:cc.Node = cc.find(guide.guidePath,rootNode);
        let guidePoint = this.node.convertToNodeSpaceAR(guideNode.convertToWorldSpaceAR(cc.v2(0,0)));
        this.tipHand.active = true;
        this.tipHand.x = guidePoint.x;
        this.tipHand.y = guidePoint.y;
        this.tipHand.width = guideNode.width;
        this.tipHand.height = guideNode.height;
        this._updateClickableArea();
    }
    reset(){
        this.tipHand.height = 0;
        this.tipHand.width = 0;
        this.tipHand.x = 0;
        this.tipHand.y = 0;
        this.tipHand.scale = 1;
        this.tipHand.active = false;
        
        // this.mask.type = cc.Mask.Type.RECT;
        // this.mask.node.width = 0;
        // this.mask.node.height = 0;
        // this.mask.node.active = true;
        // this.curtain.anchorY = 0.5;
    }


    touchEnd(event) {
        this.sendNextStep();
    }


    sendNextStep(){
        app.userData.story++;
        // let msg = new PB.message.SendStory();
        // msg.data = app.noobGuideIndex;
        // let pack = new PackageBase(Message.SendStory);
        // pack.d(msg).to(app.sever);
        // this.hide();
    }

    _updateClickableArea() {
        cc.find('topMask', this.node).y = this.tipHand.y + this.tipHand.height * 0.5;
        cc.find('bottomMask', this.node).y = this.tipHand.y - this.tipHand.height * 0.5;
        cc.find('rightMask', this.node).x = this.tipHand.x + this.tipHand.width * 0.5;
        cc.find('leftMask', this.node).x = this.tipHand.x - this.tipHand.width * 0.5;
    }
}
