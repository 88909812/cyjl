import { app } from '../app';
import BaseNode from '../base/BaseNode';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class Hall extends BaseNode {
    onLoad () {
        super.onLoad();
    }
    start(){
        app.uiBaseEvent.emit('reqGuanKaInfo');
    }
    onEnable() {
        super.onEnable();
        
    }
    onDisable(){
        super.onDisable();
    }



}