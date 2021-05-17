import { app } from '../app';
import BaseNode from '../base/BaseNode';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
import GameUI from './GameUI';
const {ccclass, property} = cc._decorator;
@ccclass
export default class GameScene extends BaseNode {
    data = null;
    onLoad () {
        super.onLoad();
    }
    onEnable() {
        super.onEnable();
        this.onEventUI('CheckPointInit',()=>{
            this.init();
        });

        let listeners = ['BackStartGuanKa','BackGuanKaComplete','BackGetGuanKaAward','SendReachEnd'];
        this.register(listeners);
    }
    onDisable(){
        super.onDisable();
    }
    init(){
        let StartGuanKa = new app.PB.message.StartGuanKa();
        StartGuanKa.tag = 'main';
        StartGuanKa.id = app.checkPointData.id;
        let pack = new PackageBase(Message.StartGuanKa);
        pack.d(StartGuanKa).to(app.sever);
    }
    BackStartGuanKa(res){
        console.log(res);
        
        this.getComponentInChildren(GameUI).refreshCheckPointInfo();

        if (res.code!=app.PB.message.BackStartGuanKa.RetCode.RC_OK) {
            let msg = '';
            switch (res.code) {
                case app.PB.message.BackStartGuanKa.RetCode.RC_WRONG_ID:
                    msg = '错误的关卡';
                    break;
                case app.PB.message.BackStartGuanKa.RetCode.RC_NOT_ENOUGH_TILI:
                    msg = '体力不足';
                    break;
                case app.PB.message.BackStartGuanKa.RetCode.RC_OTHER:
                    msg = '未知错误';
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
            app.uiManager.showUI('TipPanel', args, () => {
                cc.director.loadScene('Hall');
            });
            return;
        }
        this.data = res;
        this.getComponentInChildren(GameUI).setFreeTipNum(this.data.freeTipNum);
        this.getComponentInChildren(GameUI).init();
    }
    BackGuanKaComplete(res){
        console.log(res);
        if (res.code!=app.PB.message.BackGuanKaComplete.RetCode.RC_OK) {
            let msg = '';
            switch (res.code) {
                case app.PB.message.BackGuanKaComplete.RetCode.RC_WRONG_ID:
                    msg = '错误的关卡';
                    break;
                case app.PB.message.BackGuanKaComplete.RetCode.RC_WRONG_IDENTIFIER:
                    msg = '错误的标识';
                    break;
                case app.PB.message.BackGuanKaComplete.RetCode.RC_OTHER:
                    msg = '未知错误';
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
            app.uiManager.showUI('TipPanel', args, () => {
                cc.director.loadScene('Hall');
            });
            return;
        }
        app.uiManager.showUI('PassView',res,this.data.identifier);
    }
    BackGetGuanKaAward(res){
        console.log(res);
        if (res.code!=app.PB.message.BackGetGuanKaAward.RetCode.RC_OK) {
            let msg = '';
            switch (res.code) {
                case app.PB.message.BackGetGuanKaAward.RetCode.RC_WRONG_ID:
                    msg = '错误的关卡';
                    break;
                case app.PB.message.BackGetGuanKaAward.RetCode.RC_WRONG_IDENTIFIER:
                    msg = '错误的标识';
                    break;
                case app.PB.message.BackGetGuanKaAward.RetCode.RC_ALREADY_REWARD:
                    msg = '重复领取';
                    break;
                default:
                    msg = '未知错误';
                    break;
            }
            if (res.msg && res.msg.length > 0) {
                msg = msg + ':' + res.msg;
            }
            app.uiManager.showUI('MessageNode', msg);
            return;
        }
        if (res.stone>0) {
            app.uiManager.showUI('GetReward','stone',res.stone)
        }
        if (res.tili>0) {
            app.uiManager.showUI('GetReward','tili',res.tili)
        }
        if (res.exp>0) {
            app.uiManager.showUI('GetReward','exp',res.exp)
        }
    }
    SendReachEnd(res){
        console.log(res);
    }
}