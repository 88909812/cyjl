import IdiomExplain from '../../Prefabs/IdiomExplain';
import { app } from '../app';
import BaseView from '../base/BaseView';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
import GameScene from './GameScene';
const {ccclass, property} = cc._decorator;
@ccclass
export default class PassView extends BaseView {
    nodePool:cc.NodePool = new cc.NodePool();
    @property(cc.Prefab)
    itemPfb:cc.Prefab = null;
    @property(cc.Node)
    layer:cc.Node = null;
    @property(cc.Label)
    tili:cc.Label = null;
    @property(cc.Label)
    checkpoint:cc.Label = null;

    @property(cc.Sprite)
    bg:cc.Sprite = null;
    @property(cc.SpriteFrame)
    dayBg:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    mainBg:cc.SpriteFrame = null;

    @property(cc.Sprite)
    frame:cc.Sprite = null;
    @property(cc.SpriteFrame)
    dayFrame:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    mainFrame:cc.SpriteFrame = null;

    @property(cc.Node)
    checkpointBtn:cc.Node = null;
    @property(cc.Node)
    dailyGameBtn:cc.Node = null;

    curIdiom = '';

    data = null;
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
        this.onEventUI('UpdateUserInfo',()=>{
            this.refreshInfo();
        });

        let listeners = ['BackCyExplain'];
        this.register(listeners);
        
    }
    onDisable(){
        super.onDisable();
    }
    show(res,identifier){
        app.soundManager.playGamePass();
        this.clearAllNode();
        this.data = res;
        app.userData.lastGuanKa = this.data.guanka;
        this.refreshInfo()

        let cells;
        if (cc.Canvas.instance.getComponent(GameScene).data.tag == 'day') {
            cells = app.dailyGameData.data.cy;
            this.dailyGameBtn.active = true;
            this.checkpointBtn.active = false;
            this.checkpoint.string = '每日一关';

            this.bg.spriteFrame = this.dayBg;
            this.frame.spriteFrame = this.dayFrame;
        }else{
            cells = app.checkPointData.data.cy;
            this.dailyGameBtn.active = false;
            this.checkpointBtn.active = true;
            this.checkpoint.string = '第'+app.checkPointData.id+'关';

            this.bg.spriteFrame = this.mainBg;
            this.frame.spriteFrame = this.mainFrame;
        }
        for (let index = 0; index < cells.length; index++) {
            const cell = cells[index];
            let itemNode = this.nodePool.get()||cc.instantiate(this.itemPfb);
            itemNode.parent = this.layer;
            let idiomExplain = itemNode.getComponent(IdiomExplain)
            idiomExplain.init(cell);
        }

        this.scheduleOnce(()=>{
            if (res.exp>0) {
                app.uiManager.showUI('RewardPanel','exp',res.exp,identifier);
            }else if (res.tili>0) {
                app.uiManager.showUI('RewardPanel','tili',res.tili,identifier);
            }else if (res.stone>0) {
                app.uiManager.showUI('RewardPanel','stone',res.stone,identifier);
            }else if (res.doubleStone5) {
                app.uiManager.showUI('RewardPanel','stone','灵石翻倍效果\n（5个新关卡内有效）',identifier);
            }
        },0.3);
    }
    refreshInfo(){
        if (app.userData.data) {
            this.tili.string = app.userData.data.tili;
        }
    }
    clearAllNode(){
        let children:IdiomExplain[] = this.layer.getComponentsInChildren(IdiomExplain);
        for(let i = children.length - 1; i >= 0; i--) {
            let node = children[i].node;
            this.nodePool.put(node);
        }
    }
    BackCyExplain(res:{pinyin:string[],explain:string,source:string}){
        app.uiManager.showUI('ExplainPanel',res,this.curIdiom)
    }
    onClickNextCheckpoint(event:cc.Button){
        app.uiBaseEvent.emit('reqGuanKaInfo');
        this.onClickClose();
    }
    onClickReturn(event:cc.Button){
        app.soundManager.playClick();
        cc.director.loadScene('Hall');
    }
    onClickAddPower(event:cc.Button){
        app.soundManager.playClick();
        app.uiManager.showUI('TiliPanel');
    }
}