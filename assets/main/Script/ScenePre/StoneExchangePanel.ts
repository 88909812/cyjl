import { app } from '../app';
import BasePanel from '../base/BasePanel';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
import { formatStoneToYuan } from '../tools/utils';
const {ccclass, property} = cc._decorator;
@ccclass
export default class StoneExchangePanel extends BasePanel {
    @property(cc.Label)
    stone:cc.Label = null;
    @property(cc.Label)
    yuan:cc.Label = null;
    @property(cc.Label)
    cash:cc.Label = null;
    onLoad () {
        super.onLoad();
    }
    onClickCurtain(){
        this.onClickClose();
    }
    onEnable() {
        super.onEnable();
        this.onEventUI('UpdateUserInfo',()=>{
            this.refreshInfo();
        });
    }
    onDisable(){
        super.onDisable();
    }
    show(){
        this.refreshInfo();
    }
    refreshInfo(){
        if (app.userData.data) {
            this.stone.string = app.userData.data.stone;
            this.yuan.string = '约'+formatStoneToYuan(app.userData.data.stone);
            this.cash.string = formatStoneToYuan(app.userData.data.stone);
        }
    }
    onClickWithdraw(event:cc.Button){}
    onClickExchangeHongbao(event:cc.Button){}
}