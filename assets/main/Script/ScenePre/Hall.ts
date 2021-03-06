import { app } from '../app';
import BaseNode from '../base/BaseNode';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class Hall extends BaseNode {
    onLoad () {
        super.onLoad();
    }
    start(){
        app.uiBaseEvent.emit('reqGuanKaInfo');

        if (app.inviteId!=0) {
            console.log('send--invite---id=',app.inviteId);
            let msg = new app.PB.message.ClientTell();
            msg.targetUserId = app.inviteId;
            msg.tag = 'invite';
            let pack = new PackageBase(Message.ClientTell);
            pack.d(msg).to(app.sever);
            app.inviteId = 0;//发完后清空邀请信息
        }

        this.checkNoobGuide();
    }
    onEnable() {
        super.onEnable();
        let listeners = ['BackStartGuanKa'];
        this.register(listeners);
    }
    onDisable(){
        super.onDisable();
    }

    BackStartGuanKa(res){
        console.log(res);
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
        if (res.tag == 'day') {
            app.uiViewEvent.emit('StartDailyGame',res);
        }else{
            app.uiViewEvent.emit('StartCheckPoint',res);
        }
        
    }

    checkNoobGuide(){
        if (!app.userData||typeof(app.userData.story)!='number') {
            return;
        }
        if (app.userData.story >= 2) {
            app.platform.initAuthButton();
            return;
        }

        let noobGuideNode = cc.Canvas.instance.node.getChildByName('NoobGuide');
        if (noobGuideNode && noobGuideNode.active) {
            return;
        }
        let guide = app.NoobGuideStep[app.userData.story];
        if (!guide) {
            return;
        }
        let rootNode:cc.Node = cc.find(guide.rootPath);
        if (!rootNode||!rootNode.active||!rootNode.isValid) {
            return;
        }
        app.uiManager.showUI('NoobGuide',guide,rootNode);
    }
}