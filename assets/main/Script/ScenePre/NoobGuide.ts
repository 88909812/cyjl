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

    show(guide,rootNode,text?:string){
        this.reset();

        let rects:cc.Rect[] = [];
        for (let index = 0; index < guide.nodePaths.length; index++) {
            const nodePath = guide.nodePaths[index];
            let showNode:cc.Node = cc.find(nodePath,rootNode);
            if (!showNode || !showNode.active) {
                break;
            }
            let nodePoint = this.mask.node.convertToNodeSpaceAR(showNode.convertToWorldSpaceAR(cc.v2(0,0)));
            rects.push(cc.rect(nodePoint.x-showNode.width*showNode.anchorX,nodePoint.y-showNode.height*showNode.anchorY,showNode.width,showNode.height));
        }
        this.mask.init(rects);


        let guideNode: cc.Node = cc.find(guide.guidePath, rootNode);
        let guidePoint = this.node.convertToNodeSpaceAR(guideNode.convertToWorldSpaceAR(cc.v2(0, 0)));
        this.tipHand.x = guidePoint.x + guideNode.width * (0.5 - guideNode.anchorX);
        this.tipHand.y = guidePoint.y + guideNode.height * (0.5 - guideNode.anchorY);
        this.tipHand.width = guideNode.width;
        this.tipHand.height = guideNode.height;
        this._updateTipInfo(guide);
        this._updateClickableArea();
    }
    reset(){

    }


    touchEnd(event) {
        this.sendNextStep();
    }


    sendNextStep(){
        app.userData.story++;
        let msg = new app.PB.message.SendStory();
        msg.data = app.userData.story;
        let pack = new PackageBase(Message.SendStory);
        pack.d(msg).to(app.sever);
        this.hide();
    }
    showGuideNode(showNodes,guideNode,str){
        this.node.active = true;
        let rects:cc.Rect[] = [];
        for (let index = 0; index < showNodes.length; index++) {
            let showNode = showNodes[index];
            let nodePoint = this.mask.node.convertToNodeSpaceAR(showNode.convertToWorldSpaceAR(cc.v2(0,0)));
            rects.push(cc.rect(nodePoint.x-showNode.width*showNode.anchorX,nodePoint.y-showNode.height*showNode.anchorY,showNode.width,showNode.height));
        }
        this.mask.add(rects);

        let guidePoint = this.node.convertToNodeSpaceAR(guideNode.convertToWorldSpaceAR(cc.v2(0, 0)));
        this.tipHand.x = guidePoint.x + guideNode.width * (0.5 - guideNode.anchorX);
        this.tipHand.y = guidePoint.y + guideNode.height * (0.5 - guideNode.anchorY);
        this.tipHand.width = guideNode.width;
        this.tipHand.height = guideNode.height;
        this._updateTipInfo({text:str});
        this._updateClickableArea();
    }
    _updateTipInfo(guide){
        this.tipHand.children.forEach(node => {
            node.active = false;
        });
        let space = 20;
        //判断是否在坐边
        if (this.tipHand.x + this.tipHand.width / 2 < 0) {
            let node = this.tipHand.getChildByName('guide_left');
            node.active = true;
            node.x = this.tipHand.width / 2 + space;
            let text = node.getComponentInChildren(cc.RichText);
            text.string = guide.text;
            text.node.x = -(this.tipHand.width + space);
            text.node.y = -(this.tipHand.height / 2 + space);
        } else {
            let node = this.tipHand.getChildByName('guide_top')
            node.active = true;
            node.y = this.tipHand.height / 2 + space;
            let text = node.getComponentInChildren(cc.RichText);
            text.string = guide.text;
        }
    }
    _updateClickableArea() {
        cc.find('topMask', this.node).y = this.tipHand.y + this.tipHand.height * 0.5;
        cc.find('bottomMask', this.node).y = this.tipHand.y - this.tipHand.height * 0.5;
        cc.find('rightMask', this.node).x = this.tipHand.x + this.tipHand.width * 0.5;
        cc.find('leftMask', this.node).x = this.tipHand.x - this.tipHand.width * 0.5;
    }
}
