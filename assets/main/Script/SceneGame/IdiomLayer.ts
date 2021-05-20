import IdiomCell from '../../Prefabs/IdiomCell';
import { app } from '../app';
import BaseNode from '../base/BaseNode';
import { CellStatus } from '../GameDefine';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
import GameScene from './GameScene';
import WordLayer from './WordLayer';

const Scale_8X8 = 1.125;
const Scale_9X9 = 1;
const {ccclass, property} = cc._decorator;
@ccclass
export default class IdiomLayer extends BaseNode {
    @property(cc.Prefab)
    cellPfb:cc.Prefab = null;
    nodePool:cc.NodePool = new cc.NodePool();
    idiomCells:IdiomCell[] = [];
    isComplete = false;
    onLoad () {
        super.onLoad();
    }
    onEnable() {
        super.onEnable();
        this.onEventUI('onClickWord',(data)=>{
            let idiomCell:IdiomCell = null;
            for (let index = 0; index < this.idiomCells.length; index++) {
                idiomCell = this.idiomCells[index];
                if (idiomCell.isSelect) {
                    idiomCell.setCell(data);
                    break;
                }
            }
            if (!idiomCell) {//填入失败,返回这个字
                app.uiViewEvent.emit('BackCell',data);
            }else{
                //填入成功后检测这个字是否能完成成语
                let isComplete = idiomCell.judgeComplete();
                //没有完成成语的话，直接跳到下一个空格
                if (!isComplete) {
                    this.jumpToNextGrid();
                }
            }
            this.saveOperation();
        });

        this.onEventUI('IdiomComplete',(idiomCells:IdiomCell[])=>{
            let isRight = true;
            for (let index = 0; index < idiomCells.length; index++) {
                const idiomCell = idiomCells[index];
                if (idiomCell.data.isBlank) {
                    if (idiomCell.data.str != idiomCell.label.string) {
                        isRight = false;
                    }
                }
            }
            if (isRight) {
                app.soundManager.playRight();
                this.sendCompleteIdiom(idiomCells);
                //答对成语，直接跳到下一个空格
                this.jumpToNextGrid();
            }else{
                app.soundManager.playWrong();
                for (let index = 0; index < idiomCells.length; index++) {
                    const idiomCell = idiomCells[index];
                    idiomCell.setState(CellStatus.Wrong);
                }
            }
        });
    }
    onDisable(){
        super.onDisable();
    }
    init(cells,width,height){
        this.clearAllNode();
        this.isComplete = false;
        console.log('cells==',cells);
        for (let index = 0; index < cells.length; index++) {
            const cell = cells[index];
            let itemNode = this.nodePool.get()||cc.instantiate(this.cellPfb);
            itemNode.parent = this.node;
            let idiomCell = itemNode.getComponent(IdiomCell)
            idiomCell.initCell(cell,width,height);
            this.idiomCells.push(idiomCell);
        }
        //默认选择第一个空白元素
        this.jumpToNextGrid();

        if (width==8&&height==8) {
            this.node.scale = Scale_8X8;
        }else{
            this.node.scale = Scale_9X9;
        }
    }

    jumpToNextGrid(){
        for (let index = 0; index < this.idiomCells.length; index++) {
            const idiomCell = this.idiomCells[index];
            if (idiomCell.label.string == '') {
                idiomCell.setSelect();
                break;
            }
        }
    }
    getSelectCell():IdiomCell{
        for (let index = 0; index < this.idiomCells.length; index++) {
            const idiomCell = this.idiomCells[index];
            if (idiomCell.isSelect) {
                return idiomCell;
            }
        }
    }
    sendCompleteIdiom(idiomCells){
        let idiom = '';
        for (let index = 0; index < idiomCells.length; index++) {
            const idiomCell:IdiomCell = idiomCells[index];
            idiomCell.setState(CellStatus.Right,index/4);
            idiom+=idiomCell.data.str;
        }

        let SendCyComplete = new app.PB.message.SendCyComplete();
        SendCyComplete.identifier = cc.Canvas.instance.getComponent(GameScene).data.identifier;
        SendCyComplete.cy = idiom;
        let pack = new PackageBase(Message.SendCyComplete);
        pack.d(SendCyComplete).to(app.sever);

        let idiomRewards = cc.Canvas.instance.getComponent(GameScene).data.cylist;
        for (let index = 0; index < idiomRewards.length; index++) {
            const idiomReward = idiomRewards[index];
            if (idiomReward.str == idiom) {
                app.uiManager.showUI('GetReward','stone',idiomReward.stone)
            }
        }
        this.sendCompleteCheckPoint();
    }
    sendCompleteCheckPoint(){
        if (this.isComplete) {
            return;
        }
        this.isComplete = true;

        let children: IdiomCell[] = this.node.getComponentsInChildren(IdiomCell);
        for (let index = 0; index < children.length; index++) {
            const idiomCell = children[index];
            if (idiomCell.data.isBlank && idiomCell.data.state != CellStatus.Right) {
                this.isComplete = false;
                break;
            }
        }

        if (this.isComplete) {
            //如果完成的话，延时发送成功消息，让动画播放完
            this.scheduleOnce(() => {
                let SendGuanKaComplete = new app.PB.message.SendGuanKaComplete();
                SendGuanKaComplete.identifier = cc.Canvas.instance.getComponent(GameScene).data.identifier;
                let pack = new PackageBase(Message.SendGuanKaComplete);
                pack.d(SendGuanKaComplete).to(app.sever);
            }, 1.2);
        }
        
    }
    saveOperation() {
        //每日一关不存储关卡数据
        if (cc.Canvas.instance.getComponent(GameScene).data.tag == 'day') {
            return;
        }
        let children: IdiomCell[] = this.node.getComponentsInChildren(IdiomCell);
        for (let index = 0; index < children.length; index++) {
            const idiomCell = children[index];
            app.checkPointData.data.list[index] = idiomCell.data;
        }
        app.checkPointData.data.selection = cc.Canvas.instance.getComponentInChildren(WordLayer).getWords();
        cc.sys.localStorage.setItem('checkPointData', JSON.stringify(app.checkPointData));
    }

    clearAllNode(){
        this.idiomCells = [];
        let children:IdiomCell[] = this.node.getComponentsInChildren(IdiomCell);
        for(let i = children.length - 1; i >= 0; i--) {
            let node = children[i].node;
            this.nodePool.put(node);
        }
    }

    exportPos(){//导出坐标
        // let children:cc.Node[] = this.node.children;
        // let pos = [];
        // for (let index = 0; index < 9; index++) {
        //     pos[index] = [];
        //     for (let j = 0; j < 9; j++) {
        //         pos[index].push(children.shift().position);
        //     }
        // }
        // if (cc.sys.isNative) {
        //     let objFileName = 'IdiomPos.json';
        //     jsb.fileUtils.writeStringToFile(JSON.stringify(pos),jsb.fileUtils.getWritablePath()+objFileName);
            
        //     console.log('导出成功！导出文件夹：'+jsb.fileUtils.getWritablePath());
        // }
    }
}