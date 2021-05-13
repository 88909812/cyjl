import RankItem from '../../Prefabs/RankItem';
import BasePanel from '../base/BasePanel';
import ScrollPiecewise from '../components/ScrollPiecewise';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class RankPanel extends BasePanel {
    @property(ScrollPiecewise)
    rankList:ScrollPiecewise = null;
    @property(RankItem)
    selfItem:RankItem = null;
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
    show(){
        
    }
    onClickShare(event:cc.Button){
        
    }
}