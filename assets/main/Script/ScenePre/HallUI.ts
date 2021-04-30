import { app } from '../app';
import BaseNode from '../base/BaseNode';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class HallUI extends BaseNode {
    onLoad () {
        super.onLoad();
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }

    onClickStartGame(event:cc.Button){
        cc.director.loadScene('GameScene');
    }
    
    onClickSet(event:cc.Button){
        app.uiManager.showUI('SetPanel');
    }
    onClickRank(event:cc.Button){

    }
}