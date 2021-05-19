import HeadNode from '../../Prefabs/HeadNode';
import { app } from '../app';
import BaseNode from '../base/BaseNode';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
import NoobGuide from '../ScenePre/NoobGuide';
import GameScene from './GameScene';
import IdiomLayer from './IdiomLayer';
import WordLayer from './WordLayer';
const {ccclass, property} = cc._decorator;
@ccclass
export default class GameUI extends BaseNode {
    @property(cc.Node)
    curtain:cc.Node = null;
    cells = [];
    @property(cc.Label)
    checkpointLab:cc.Label = null;
    @property(cc.Label)
    freeTipNum:cc.Label = null;
    @property(HeadNode)
    avatar:HeadNode = null;

    checkpointIndex = 1;
    c_width = 9;
    c_height = 9;
    onLoad () {
        super.onLoad();
        this.getComponent(cc.Widget).top = app.statusBarHeight;
        this.refreshInfo();

        this.avatar.initClickHandler();
    }
    onEnable() {
        super.onEnable();
        this.onEventUI('UpdateUserInfo',()=>{
            this.refreshInfo();
        });
    }
    onDisable(){
        super.onDisable();
    }
    init(data){
        app.checkPointData.data.list.sort((a, b) => { return a.pos - b.pos; });
        this.getComponentInChildren(IdiomLayer).init(app.checkPointData.data.list,app.checkPointData.data.width,app.checkPointData.data.height);
        this.getComponentInChildren(WordLayer).init(app.checkPointData.data.selection);

        this.curtain.active = false;
        if (data.first) {
            this.curtain.active = true;
            this.scheduleOnce(()=>{
                this.curtain.active = false;
                this.checkNoobGuide();
            },3);
        }else{
            this.scheduleOnce(()=>{
                this.checkNoobGuide();
            },0.1);
        }
    }
    refreshInfo(){
        if (app.userData.data) {
            this.avatar.init(app.userData.data.avatar);
        }
    }
    setFreeTipNum(num:number){
        this.freeTipNum.node.parent.active = num>0;
        this.freeTipNum.string = num+'';
    }
    refreshCheckPointInfo(){
        this.checkpointLab.string = '第'+app.checkPointData.id+'关';
    }
    onClickTip(event:cc.Button){
        app.soundManager.playClick();
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
        app.soundManager.playClick();
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
    onClickLingshi(event:cc.Button){
        app.soundManager.playClick();
    }
    onClickReturn(event:cc.Button){
        app.soundManager.playClick();
        cc.director.loadScene('Hall');
    }
    checkNoobGuide(){
        if (!app.userData||typeof(app.userData.story)!='number') {
            return;
        }
        if (app.userData.story >= 2) {
            app.platform.initAuthButton();
            return;
        }

        let noobGuideNode = cc.Canvas.instance.node.getChildByName('NoobGuide');
        if (noobGuideNode && noobGuideNode.active) {
            return;
        }
        let guide = app.NoobGuideStep[app.userData.story];
        if (!guide) {
            return;
        }
        let rootNode:cc.Node = cc.find(guide.rootPath);
        if (!rootNode||!rootNode.active||!rootNode.isValid) {
            return;
        }
        let showNodes:cc.Node[] = [];
        let cell = this.getComponentInChildren(IdiomLayer).getSelectCell();
        showNodes.push(cell.node);
        let word = this.getComponentInChildren(WordLayer).getWordObjectByStr(cell.data.str);
        if (word) {
            showNodes.push(word.node);
            let str = '点击“<color=#FFE854>'+cell.data.str+'</c>”字，组成成语';
            this.getComponentInChildren(NoobGuide).showGuideNode(showNodes,word.node,str);
        }
        
    }
}