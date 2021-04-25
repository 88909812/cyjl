import { app } from '../app';
import BaseView from '../base/BaseView';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class PassView extends BaseView {
    curIdiom = '';
    onLoad () {
        super.onLoad();
    }
    onEnable() {
        super.onEnable();
        this.onEventUI('TipIdiom',(idiom)=>{
            this.curIdiom = idiom;
            //to do:请求成语详情GetCyExplain
        });


        let listeners = ['BackCyExplain'];
        this.register(listeners);
        
    }
    onDisable(){
        super.onDisable();
    }
    show(){
        
    }
    BackCyExplain(res:{pinyin:string[],explain:string,source:string}){
        app.uiManager.showUI('ExplainPanel',res,this.curIdiom)
    }
    onClickNextCheckpoint(event:cc.Button){}
    onClickReturn(event:cc.Button){}
    onClickAddPower(event:cc.Button){}
}