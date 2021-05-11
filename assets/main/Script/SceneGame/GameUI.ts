import { app } from '../app';
import BaseView from '../base/BaseView';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
import GameScene from './GameScene';
import IdiomLayer from './IdiomLayer';
import WordLayer from './WordLayer';
const {ccclass, property} = cc._decorator;
@ccclass
export default class GameUI extends BaseView {
    cells = [];
    @property(cc.Label)
    checkpointLab:cc.Label = null;
    @property(cc.Label)
    freeTipNum:cc.Label = null;

    checkpointIndex = 1;
    c_width = 9;
    c_height = 9;
    onLoad () {
        super.onLoad();
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }
    init(){
        this.getComponentInChildren(IdiomLayer).init(app.checkPointData.data.list,app.checkPointData.data.width,app.checkPointData.data.height);
        this.getComponentInChildren(WordLayer).init(app.checkPointData.data.selection);
    }
    setFreeTipNum(num:number){
        this.freeTipNum.node.parent.active = num>0;
        this.freeTipNum.string = num+'';
    }
    refreshCheckPointInfo(){
        this.checkpointLab.string = '第'+app.checkPointData.id+'关';
    }
    onClickTip(event:cc.Button){
        if (cc.Canvas.instance.getComponent(GameScene).data.freeTipNum<=0) {
            return;
        }

        let SendUseFreeTip = new app.PB.message.SendUseFreeTip();
        SendUseFreeTip.identifier = cc.Canvas.instance.getComponent(GameScene).data.identifier;
        let pack = new PackageBase(Message.SendUseFreeTip);
        pack.d(SendUseFreeTip).to(app.sever);
        
        
        cc.Canvas.instance.getComponent(GameScene).data.freeTipNum--;
        this.setFreeTipNum(cc.Canvas.instance.getComponent(GameScene).data.freeTipNum);

        let selectCell = this.getComponentInChildren(IdiomLayer).getSelectCell();
        let words = this.getComponentInChildren(WordLayer).getWordObjects();
        for (let index = 0; index < words.length; index++) {
            const word = words[index];
            if (word.data.word == selectCell.data.str) {
                word.onClick();
                break;
            }
        }
    }
    onClickReplay(event:cc.Button){
        let args = {
            isConfirm: false,
            content: '重新开始本关？'
        }
        app.uiManager.showUI('TipPanel',args,()=>{
            let guankaIndex = 1;
            if (app.userData.lastGuanKa && app.userData.lastGuanKa.main) {
                guankaIndex = app.userData.lastGuanKa.main;
            }
            let RequestGuanKaInfo = new app.PB.message.RequestGuanKaInfo();
            RequestGuanKaInfo.startId = guankaIndex;
            RequestGuanKaInfo.num = 1;
            let pack = new PackageBase(Message.RequestGuanKaInfo);
            pack.d(RequestGuanKaInfo).to(app.sever);
        });
    }
    onClickLingshi(event:cc.Button){}
    onClickReturn(event:cc.Button){
        cc.director.loadScene('Hall');
    }
}