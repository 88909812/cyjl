import { app } from "../Script/app";
import BaseNode from "../Script/base/BaseNode";

const {ccclass, property} = cc._decorator;
@ccclass
export default class IdiomExplain extends BaseNode {
    @property(cc.Label)
    idiomLab:cc.Label = null;
    onLoad () {
        super.onLoad();
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
        app.soundManager.playClick();
        app.uiViewEvent.emit('TipIdiom',this.idiomLab.string);
    }
}