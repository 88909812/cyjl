import BaseNode from "../Script/base/BaseNode";
import HeadNode from "./HeadNode";

const {ccclass, property} = cc._decorator;
@ccclass
export default class RankItem extends BaseNode {
    @property(cc.Label)
    rankNum:cc.Label = null;
    @property(cc.Node)
    rankImg:cc.Node = null;
    @property(cc.Label)
    levelName:cc.Label = null;

    @property(cc.Label)
    playerName:cc.Label = null;
    @property(cc.Label)
    checkpoint:cc.Label = null;

    @property(HeadNode)
    avatar:HeadNode = null;

    onLoad () {
        super.onLoad();
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }
    init(data){
        this.setRank(1);
    }
    setRank(num){
        this.rankImg.children.forEach((imgNode)=>{
            imgNode.active = false;
        })
        this.rankNum.node.active = false;
        if (num<=3) {
            this.rankImg.getChildByName(num+'').active = true;
        }else{
            this.rankNum.string = num+'';
            this.rankNum.node.active = true;
        }
    }
    
}