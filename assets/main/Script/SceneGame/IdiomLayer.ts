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
    onLoad () {
        super.onLoad();
    }
    onEnable() {
        super.onEnable();
        this.onEventUI('onClickWord',(data)=>{
            let isSuccess = false;
            for (let index = 0; index < this.idiomCells.length; index++) {
                const idiomCell = this.idiomCells[index];
                if (idiomCell.isSelect) {
                    idiomCell.setCell(data);
                    isSuccess = true;
                    break;
                }
            }
            if (!isSuccess) {
                app.uiViewEvent.emit('BackCell',data);
            }else{
                for (let index = 0; index < this.idiomCells.length; index++) {
                    const idiomCell = this.idiomCells[index];
                    if (idiomCell.label.string == '') {
                        idiomCell.setSelect();
                        break;
                    }
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
                this.sendComplete(idiomCells);
            }else{
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
    sendComplete(idiomCells){
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
    }
    saveOperation() {
        let children: IdiomCell[] = this.node.getComponentsInChildren(IdiomCell);
        for (let index = 0; index < children.length; index++) {
            const idiomCell = children[index];
            app.checkPointData.data.list[index] = idiomCell.data;
        }
        app.checkPointData.data.selection = cc.Canvas.instance.getComponentInChildren(WordLayer).getWords();
        cc.sys.localStorage.setItem('checkPointData', JSON.stringify(app.checkPointData));
    }
    init(cells,width,height){
        this.clearAllNode();
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
        for (let index = 0; index < cells.length; index++) {
            const cell = cells[index];
            if (cell.state) {//有本地记录的情况
                if (cell.state == CellStatus.Empty) {
                    this.idiomCells[index].setSelect();
                    break;
                }
            }else if (cell.isBlank) {//无本地记录的情况
                this.idiomCells[index].setSelect();
                break;
            }
        }
        if (width==8&&height==8) {
            this.node.scale = Scale_8X8;
        }else{
            this.node.scale = Scale_9X9;
        }
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