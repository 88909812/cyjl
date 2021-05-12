import BaseNode from '../base/BaseNode';
const {ccclass, property} = cc._decorator;
@ccclass
export default class ProgressAni extends BaseNode {

    percent = 0;
    curProgress = 0;
    isAniPlaying = false;
    isUp = true;

    totalNum = 0
    desLabel:cc.Label = null;
    callback = null;
    cellProgress = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //########@@@ label的层级必须和progress是同一级,且唯一 @@@##########
        this.desLabel = this.node.getComponentInChildren(cc.Label);
        if (this.desLabel) {
            this.desLabel.string = '';
        }
    }

    initProgress(percent:number = 0,totalNum:number = 0,runtime = 2){
        this.percent = percent;
        this.curProgress = this.percent;
        this.getComponent(cc.ProgressBar).progress = this.curProgress;

        this.totalNum = totalNum;
        if (this.desLabel) {
            this.desLabel.string = ''+ Math.floor(this.totalNum*this.curProgress);
        }

        this.cellProgress = 1/runtime;
    }
    progressTo(percent: number,callback = null) {
        this.callback = callback;
        this.curProgress = this.percent;
        this.percent = percent;

        this.isAniPlaying = true;
        this.isUp = this.percent >= this.curProgress;
        //目前采用总进度多少秒的形式，废弃固定时间固定进度的形式
        //this.cellProgress = Math.abs(this.percent - this.curProgress)/runtime;
    }
    update (dt:number) {
        if (this.isAniPlaying) {
            let progressNum = this.isUp ? dt*this.cellProgress : -dt*this.cellProgress;
            this.curProgress += progressNum;
            let curNum = Math.floor(this.totalNum*this.curProgress);
            
            //最终值的修正处理
            if (this.isUp) {
                if (this.curProgress >= this.percent) {
                    this.curProgress = this.percent;
                    this.isAniPlaying = false;
                    curNum = this.totalNum;
                    if (this.callback) {
                        this.callback();
                    }
                }
            } else {
                if (this.curProgress <= this.percent) {
                    this.curProgress = this.percent;
                    this.isAniPlaying = false;
                    curNum = this.totalNum;
                    if (this.callback) {
                        this.callback();
                    }
                }
            }
            this.getComponent(cc.ProgressBar).progress = this.curProgress;
            if (this.desLabel) {
                this.desLabel.string = ''+ curNum;
            }
        }
    }
}
