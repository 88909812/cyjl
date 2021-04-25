import BaseNode from '../base/BaseNode';
const {ccclass, property} = cc._decorator;
const MaxPoint = 5;
@ccclass
export default class ProgressPoint extends BaseNode {
    curPoint = 1;
    totalPoint = 1;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    show (curPoint,totalPoint) {
        this.node.active = true;
        this.reset(totalPoint);

        this.curPoint = curPoint;
        this.totalPoint = totalPoint;

        let bgs = this.node.getChildByName('bgLayout').children;
        for (let index = 0; index < bgs.length; index++) {
            bgs[index].active = index < totalPoint;
        }

        let maxWidth = 0;
        let pointLayer = this.node.getChildByName('pointLayer_' + totalPoint);
        let points = pointLayer.children;
        for (let index = 0; index < points.length; index++) {
            if (index <= (curPoint - 2)) {
                points[index].active = true;
                maxWidth = points[index].x > maxWidth ? points[index].x : maxWidth;
            } else {
                points[index].active = false;
            }
        }

        this.node.getChildByName('progress').width = maxWidth;
    }

    finish(){
        let point = this.node.getChildByName('pointLayer_' + this.totalPoint).getChildByName('point_'+this.curPoint);
        point.active = true;
        this.node.getChildByName('progress').width = point.x;
    }

    reset(totalPoint) {
        for (let index = 1; index <= MaxPoint; index++) {
            this.node.getChildByName('pointLayer_' + index).active = index == totalPoint;
        }
    }
    // update (dt) {}
}
