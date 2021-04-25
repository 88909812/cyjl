import { app } from "../Script/app";
import BaseNode from "../Script/base/BaseNode";

const {ccclass, property} = cc._decorator;
@ccclass
export default class IdiomExplain extends BaseNode {
    idiomLab:cc.Label = null;
    onLoad () {
        super.onLoad();
        this.idiomLab = this.getComponentInChildren(cc.Label);
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }
    init(idiom:string){
        this.idiomLab.string = idiom;
    }
    onClickTip(){
        app.uiViewEvent.emit('TipIdiom',this.idiomLab.string);
    }
}