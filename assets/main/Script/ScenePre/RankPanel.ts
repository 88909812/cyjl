import RankItem from '../../Prefabs/RankItem';
import { app } from '../app';
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
        let listeners=['RankData'];
        this.register(listeners);
        this.onEventUI('ReqNewData',()=>{
            this.reqNewData();
        });
    }
    onDisable(){
        super.onDisable();
    }
    show(){
        this.rankList.clearAllItem();
        this.reqNewData();
    }

    reqNewData(){
        let msg = new app.PB.message.GetRankData();
        msg.pageIndex = this.rankList.curPageIndex;
        msg.pageSize = this.rankList.maxReqCount;
        let pack = new PackageBase(Message.GetRankData);
        pack.d(msg).to(app.sever);
    }
    onClickShare(event:cc.Button){
        app.soundManager.playClick();
        app.platform.share();
    }
    RankData(res){
        console.log('RankData--',res);
        this.rankList.addDatas(res.list);
        let data = {
            rank: res.myRank,
            lvlName: app.levelData.currName,
            name: app.userData.data.name,
            guanKa: res.myRank,
            avatar: app.userData.data.avatar
        };
        this.selfItem.init(data);
    }
}