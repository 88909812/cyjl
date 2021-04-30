import { app } from "../Script/app";
import BaseNode from "../Script/base/BaseNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Word extends BaseNode {
    @property(cc.Node)
    word: cc.Node = null;
    @property(cc.Label)
    label: cc.Label = null;
    data = null;
    isReduce = false;
    onLoad(){
        super.onLoad();
        
    }
    onEnable(){
        super.onEnable();
    }
    initWord (index:number,str:string) {
        this.data = {
            index:index,
            word:str
        };
        this.label.string = str;
        this.setReduce(false);
    }
    setReduce(isReduce = true){
        this.isReduce = isReduce;
        cc.Tween.stopAllByTarget(this.word);
        if (isReduce) {
            cc.tween(this.word).set({ scale: 1 })
            .to(0.1, { scale: 1.2 }, { easing: 'backOut' })
            .to(0.2, { scale: 0 })
            .start();
        }else{
            cc.tween(this.word).set({ scale: 0 })
            .to(0.2, { scale: 1 }, { easing: 'backOut' })
            .start();
        }
    }
    onClick(){
        if (this.isReduce) {
            return;
        }
        this.setReduce();
        app.uiViewEvent.emit('onClickWord',this.data);
    }
    // update (dt) {}
}
