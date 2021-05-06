import { app } from '../app';
import BaseView from '../base/BaseView';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
import IdiomLayer from './IdiomLayer';
import WordLayer from './WordLayer';
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
        
        this.refreshInfo();

        this.getComponentInChildren(IdiomLayer).init(app.checkPointData.data.list,app.checkPointData.data.width,app.checkPointData.data.height);
        this.getComponentInChildren(WordLayer).init(app.checkPointData.data.selection);
    }
    onEnable() {
        super.onEnable();
        this.onEventUI('CheckPointUpdate',()=>{
            this.refreshInfo();
        });
    }
    onDisable(){
        super.onDisable();
    }
    refreshInfo(){
        this.checkpointLab.string = '第'+app.checkPointData.id+'关';
    }
    onClickTip(event:cc.Button){}
    onClickReplay(event:cc.Button){}
    onClickLingshi(event:cc.Button){}
    onClickReturn(event:cc.Button){
        cc.director.loadScene('Hall');
    }
}