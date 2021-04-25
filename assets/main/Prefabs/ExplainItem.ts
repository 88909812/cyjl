import BaseNode from "../Script/base/BaseNode";

const {ccclass, property} = cc._decorator;
@ccclass
export default class ExplainItem extends BaseNode {
    @property(cc.Label)
    pinyin:cc.Label = null;
    @property(cc.Label)
    chinese:cc.Label = null;
    onLoad () {
        super.onLoad();
        
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }
    init(pinyin:string,word:string){
        this.pinyin.string = pinyin;
        this.chinese.string = word;
    }
}