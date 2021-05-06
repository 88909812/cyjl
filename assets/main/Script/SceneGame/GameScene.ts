import { app } from '../app';
import BaseNode from '../base/BaseNode';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class GameScene extends BaseNode {
    data = null;
    onLoad () {
        super.onLoad();
    }
    start(){
        let StartGuanKa = new app.PB.message.StartGuanKa();
        StartGuanKa.tag = 'main';
        StartGuanKa.id = app.checkPointData.id;
        let pack = new PackageBase(Message.StartGuanKa);
        pack.d(StartGuanKa).to(app.sever);
    }
    onEnable() {
        super.onEnable();
        let listeners = ['BackStartGuanKa','BackGuanKaComplete','BackGetGuanKaAward','SendReachEnd'];
        this.register(listeners);
    }
    onDisable(){
        super.onDisable();
    }

    BackStartGuanKa(res){
        console.log(res);
        this.data = res;
    }
    BackGuanKaComplete(res){
        console.log(res);
    }
    BackGetGuanKaAward(res){
        console.log(res);
    }
    SendReachEnd(res){
        console.log(res);
    }
}