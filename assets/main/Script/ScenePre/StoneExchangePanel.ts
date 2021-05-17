import { app } from '../app';
import BasePanel from '../base/BasePanel';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
import { formatFenToYuan, formatStoneToYuan } from '../tools/utils';
const {ccclass, property} = cc._decorator;
const StoneExchangeCount = 500000;
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
        let listeners=['BackExchange','BackRequestWithDraw'];
        this.register(listeners);
        
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
            this.cash.string = formatFenToYuan(app.userData.data.money);
        }
    }
    onClickWithdraw(event:cc.Button){
        app.soundManager.playClick();
        let msg = new app.PB.message.RequestWithDraw();
        msg.val = app.userData.data.money;
        msg.way = 'wx';
        let pack = new PackageBase(Message.RequestWithDraw);
        pack.d(msg).to(app.sever);
    }
    onClickExchangeHongbao(event:cc.Button){
        app.soundManager.playClick();
        if (app.userData.data.stone<StoneExchangeCount) {
            app.uiManager.showUI('MessageNode','灵石数量不足！');
            return;
        }
        let msg = new app.PB.message.ReqExchange();
        msg.stone = StoneExchangeCount;
        let pack = new PackageBase(Message.ReqExchange);
        pack.d(msg).to(app.sever);
    }
    BackExchange(res){
        if (res.code!=app.PB.message.BackExchange.RetCode.RC_OK) {
            let msg = '';
            switch (res.code) {
                case app.PB.message.BackExchange.RetCode.RC_NOT_ENOUGTH:
                    msg = '灵石数量不足';
                    break;
                default:
                    msg = '未知错误';
                    break;
            }
            if (res.msg && res.msg.length > 0) {
                msg = msg + ':' + res.msg;
            }
            let args = {
                isConfirm: true,
                content: msg
            }
            app.uiManager.showUI('TipPanel', args);
            return;
        }
        app.uiManager.showUI('GetReward','money',res.money)
    }
    BackRequestWithDraw(res){
        if (res.code!=app.PB.message.BackRequestWithDraw.RetCode.RC_OK) {
            let msg = '';
            switch (res.code) {
                case app.PB.message.BackRequestWithDraw.RetCode.RC_NOT_ENOUGTH:
                    msg = '数量不足';
                    break;
                case app.PB.message.BackRequestWithDraw.RetCode.RC_NEW_DONE:
                    msg = '新人提现不能重复';
                    break;
                case app.PB.message.BackRequestWithDraw.RetCode.RC_NUM_ERROR:
                    msg = '金额不对,必须是指定列表中的金额';
                    break;
                case app.PB.message.BackRequestWithDraw.RetCode.RC_WAY_NOT_SUPPORTED:
                    msg = '提现方式不支持';
                    break;
                case app.PB.message.BackRequestWithDraw.RetCode.RC_WX_ACCOUNT:
                    msg = '只有微信登录才支持微信提现';
                    break;
                case app.PB.message.BackRequestWithDraw.RetCode.RC_LOW:
                    msg = '提现要求不符';
                    break;
                case app.PB.message.BackRequestWithDraw.RetCode.RC_WXACCOUNT_NOT_OFFICIAL_BINDED:
                    msg = '微信用户请先绑定公众号后提现';
                    break;
                default:
                    msg = '未知错误';
                    break;
            }
            if (res.msg && res.msg.length > 0) {
                msg = msg + ':' + res.msg;
            }
            let args = {
                isConfirm: true,
                content: msg
            }
            app.uiManager.showUI('TipPanel', args);
            return;
        }
        app.uiManager.showUI('TipPanel', {isConfirm: true,content: '提现成功，请查收！'});
    }
}