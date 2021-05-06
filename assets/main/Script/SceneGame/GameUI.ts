import BaseView from '../base/BaseView';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class GameUI extends BaseView {
    cells = [];
    @property(cc.Label)
    checkpointLab:cc.Label = null;

    checkpointIndex = 1;
    c_width = 9;
    c_height = 9;
    onLoad () {
        super.onLoad();
        this.checkpointLab.string = '第'+this.checkpointIndex+'关';
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }

    onClickTip(event:cc.Button){}
    onClickReplay(event:cc.Button){}
    onClickLingshi(event:cc.Button){}
    onClickReturn(event:cc.Button){
        cc.director.loadScene('Hall');
    }
}