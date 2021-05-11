import IdiomExplain from '../../Prefabs/IdiomExplain';
import { app } from '../app';
import BaseView from '../base/BaseView';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class PassView extends BaseView {
    nodePool:cc.NodePool = new cc.NodePool();
    @property(cc.Prefab)
    itemPfb:cc.Prefab = null;
    @property(cc.Node)
    layer:cc.Node = null;
    @property(cc.Label)
    checkpoint:cc.Label = null;
    curIdiom = '';
    onLoad () {
        super.onLoad();
    }
    onEnable() {
        super.onEnable();
        this.onEventUI('TipIdiom',(idiom)=>{
            this.curIdiom = idiom;
            //to do:请求成语详情GetCyExplain
            let GetCyExplain = new app.PB.message.GetCyExplain();
            GetCyExplain.cy = idiom;
            let pack = new PackageBase(Message.GetCyExplain);
            pack.d(GetCyExplain).to(app.sever);
        });


        let listeners = ['BackCyExplain'];
        this.register(listeners);
        
    }
    onDisable(){
        super.onDisable();
    }
    show(){
        this.checkpoint.string = '第'+app.checkPointData.id+'关';
        let cells = app.checkPointData.data.cy;
        for (let index = 0; index < cells.length; index++) {
            const cell = cells[index];
            let itemNode = this.nodePool.get()||cc.instantiate(this.itemPfb);
            itemNode.parent = this.layer;
            let idiomExplain = itemNode.getComponent(IdiomExplain)
            idiomExplain.init(cell);
        }
    }
    BackCyExplain(res:{pinyin:string[],explain:string,source:string}){
        app.uiManager.showUI('ExplainPanel',res,this.curIdiom)
    }
    onClickNextCheckpoint(event:cc.Button){
        let RequestGuanKaInfo = new app.PB.message.RequestGuanKaInfo();
        RequestGuanKaInfo.startId = app.checkPointData.id+1;
        RequestGuanKaInfo.num = 1;
        let pack = new PackageBase(Message.RequestGuanKaInfo);
        pack.d(RequestGuanKaInfo).to(app.sever);
    }
    onClickReturn(event:cc.Button){
        cc.director.loadScene('Hall');
    }
    onClickAddPower(event:cc.Button){

    }
}