import BaseNode from '../base/BaseNode';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
import {DESIGN_HEIGHT} from '../GameDefine';
import Word from '../../Prefabs/Word';
const {ccclass, property} = cc._decorator;
@ccclass
export default class WordLayer extends BaseNode {
    @property(cc.Prefab)
    wordPfb:cc.Prefab = null;
    nodePool:cc.NodePool = new cc.NodePool();
    onLoad () {
        super.onLoad();
        this.node.parent.on(cc.Node.EventType.SIZE_CHANGED,()=>{
            this.node.height = this.node.parent.height / 2 + this.node.y;
            let orignHeight = DESIGN_HEIGHT / 2 + this.node.y;
            let orignPaddingTop = this.node.getComponent(cc.Layout).paddingTop;
            let orignSpacingY = this.node.getComponent(cc.Layout).spacingY;

            let spacingY = orignSpacingY;
            
            let lineNumber = 2;

            if (this.node.height > orignHeight - spacingY * (lineNumber-1)) {
                spacingY = (this.node.height - orignHeight + spacingY * (lineNumber-1)) / (lineNumber-1);
            }else{
                spacingY = 0;
            }
            this.node.getComponent(cc.Layout).spacingY = spacingY;
            this.node.getComponent(cc.Layout).paddingTop = orignPaddingTop + (spacingY - orignSpacingY) / 2;
        })

        let str = '护发独揽搜飞机好强噢未发';
        for (let index = 0; index < str.length; index++) {
            const element = str[index];
            let itemNode = this.nodePool.get()||cc.instantiate(this.wordPfb);
            itemNode.parent = this.node;
            itemNode.getComponent(Word).initWord(index,element);
        }
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }
    clearAllNode(){
        let children:cc.Component[] = this.node.getComponentsInChildren(Word);
        for(let i = children.length - 1; i >= 0; i--) {
            let node = children[i].node;
            this.nodePool.put(node);
        }
    }
}