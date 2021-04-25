import IdiomCell from '../../Prefabs/IdiomCell';
import BaseNode from '../base/BaseNode';
import { CellStatus } from '../GameDefine';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const Scale_8X8 = 1.125;
const Scale_9X9 = 1;
const {ccclass, property} = cc._decorator;
@ccclass
export default class IdiomLayer extends BaseNode {
    @property(cc.Prefab)
    cellPfb:cc.Prefab = null;
    nodePool:cc.NodePool = new cc.NodePool();
    onLoad () {
        super.onLoad();
        
        let width = 9;
        let height = 9;
        let cells = '护发独揽身上搜飞机好强噢未发';
        for (let index = 0; index < cells.length; index++) {
            const cell = {str:cells[index],pos:index,isBlank:Boolean(index%2)};
            let itemNode = this.nodePool.get()||cc.instantiate(this.cellPfb);
            itemNode.parent = this.node;
            itemNode.getComponent(IdiomCell).initCell(cell,width,height);
        }
        if (width==8&&height==8) {
            this.node.scale = Scale_8X8;
        }else{
            this.node.scale = Scale_9X9;
        }
    }
    onEnable() {
        super.onEnable();
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
                for (let index = 0; index < idiomCells.length; index++) {
                    const idiomCell = idiomCells[index];
                    idiomCell.setState(CellStatus.Right,index/4);
                }
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
    clearAllNode(){
        let children:cc.Component[] = this.node.getComponentsInChildren(IdiomCell);
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