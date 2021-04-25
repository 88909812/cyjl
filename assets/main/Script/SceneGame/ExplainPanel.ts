import ExplainItem from '../../Prefabs/ExplainItem';
import BasePanel from '../base/BasePanel';

const {ccclass, property} = cc._decorator;
@ccclass
export default class ExplainPanel extends BasePanel {
    @property(cc.Prefab)
    explainPfb:cc.Prefab = null;
    nodePool:cc.NodePool = new cc.NodePool();
    @property(cc.Node)
    layer:cc.Node = null;

    @property(cc.Label)
    explainLab:cc.Label = null;
    @property(cc.Label)
    sourceLab:cc.Label = null;

    onLoad () {
        super.onLoad();
    }
    onClickCurtain(){
        //cc.log('如果需要添加点击幕布时的操作，你可以选择重载onClickCurtain');
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }
    show(data:{pinyin:string[],explain:string,source:string},idiom:string){
        this.clearAllNode();
        for (let index = 0; index < data.pinyin.length; index++) {
            const pinyin = data.pinyin[index];
            let itemNode = this.nodePool.get()||cc.instantiate(this.explainPfb);
            itemNode.parent = this.layer;
            itemNode.getComponent(ExplainItem).init(pinyin,idiom[index]);
        }
        this.explainLab.string = data.explain;
        this.sourceLab.string = data.source;
    }
    clearAllNode(){
        let children:ExplainItem[] = this.layer.getComponentsInChildren(ExplainItem);
        for(let i = children.length - 1; i >= 0; i--) {
            let node = children[i].node;
            this.nodePool.put(node);
        }
    }
    onClickShare(event:cc.Button){}
}