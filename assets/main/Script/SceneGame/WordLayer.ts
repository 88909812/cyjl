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
    words:Word[] = [];
    onLoad () {
        super.onLoad();
        // this.node.parent.on(cc.Node.EventType.SIZE_CHANGED,()=>{
        //     this.node.height = this.node.parent.height / 2 + this.node.y;
        //     let orignHeight = DESIGN_HEIGHT / 2 + this.node.y;
        //     let orignPaddingTop = this.node.getComponent(cc.Layout).paddingTop;
        //     let orignSpacingY = this.node.getComponent(cc.Layout).spacingY;

        //     let spacingY = orignSpacingY;
            
        //     let lineNumber = 2;

        //     if (this.node.height > orignHeight - spacingY * (lineNumber-1)) {
        //         spacingY = (this.node.height - orignHeight + spacingY * (lineNumber-1)) / (lineNumber-1);
        //     }else{
        //         spacingY = 0;
        //     }
        //     this.node.getComponent(cc.Layout).spacingY = spacingY;
        //     this.node.getComponent(cc.Layout).paddingTop = orignPaddingTop + (spacingY - orignSpacingY) / 2;
        // })

    }
    onEnable() {
        super.onEnable();
        this.onEventUI('BackCell',(cell:{index:number,word:string},cellStr:string)=>{
            let wordItem:Word = null;
            if (cell&&cell.index<this.words.length) {
                wordItem = this.words[cell.index];
                wordItem.data.word = cell.word;
            }else{
                let itemNode = this.nodePool.get()||cc.instantiate(this.wordPfb);
                itemNode.parent = this.node;
                wordItem = itemNode.getComponent(Word);
                wordItem.initWord(this.words.length,cellStr);
                this.words.push(wordItem);
                this.resetSize();
            }
            wordItem.setReduce(false);
        });
    }
    onDisable(){
        super.onDisable();
    }
    init(str){
        this.clearAllNode();

        for (let index = 0; index < str.length; index++) {
            const element = str[index];
            let itemNode = this.nodePool.get()||cc.instantiate(this.wordPfb);
            itemNode.parent = this.node;
            let word = itemNode.getComponent(Word);
            word.initWord(index,element);
            this.words.push(word);
        }
        this.resetSize();
    }
    getWords():string[]{
        let words = [];
        for (let index = 0; index < this.words.length; index++) {
            const word = this.words[index];
            if (!word.isReduce) {
                words.push(word.label.string);
            }
        }
        return words;
    }
    getWordObjects():Word[]{
        let words = [];
        for (let index = 0; index < this.words.length; index++) {
            const word = this.words[index];
            if (!word.isReduce) {
                words.push(word);
            }
        }
        return words;
    }
    resetSize(){
        for (let index = 0; index < this.words.length; index++) {
            const word = this.words[index];
            if (this.words.length>24) {
                word.node.width = 66;
                word.node.height = 67;
                word.node.getChildByName('bg').scale = 0.6;
            }
            else if (this.words.length>14) {
                word.node.width = 77;
                word.node.height = 78;
                word.node.getChildByName('bg').scale = 0.7;
            }
            else if (this.words.length>12) {
                word.node.width = 88;
                word.node.height = 90;
                word.node.getChildByName('bg').scale = 0.8;
            }
            else{
                word.node.width = 110;
                word.node.height = 112;
                word.node.getChildByName('bg').scale = 1;
            }
        }
    }
    clearAllNode(){
        this.words = [];
        let children:cc.Component[] = this.node.getComponentsInChildren(Word);
        for(let i = children.length - 1; i >= 0; i--) {
            let node = children[i].node;
            this.nodePool.put(node);
        }
    }
}