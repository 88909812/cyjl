import BaseView from '../base/BaseView';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class GameUI extends BaseView {
    onLoad () {
        super.onLoad();
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
    onClickReturn(event:cc.Button){}
}