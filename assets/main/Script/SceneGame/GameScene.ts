import BaseNode from '../base/BaseNode';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class GameScene extends BaseNode {
    onLoad () {
        super.onLoad();
    }
    onEnable() {
        super.onEnable();
        let listeners = ['GuanKaInfoList','BackStartGuanKa','BackGuanKaComplete','SendReachEnd'];
        this.register(listeners);
    }
    onDisable(){
        super.onDisable();
    }

    GuanKaInfoList(res){

    }
    BackStartGuanKa(res){

    }
    BackGuanKaComplete(res){

    }
    SendReachEnd(res){
        
    }
}