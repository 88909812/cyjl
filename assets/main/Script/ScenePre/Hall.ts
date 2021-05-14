import { app } from '../app';
import BaseNode from '../base/BaseNode';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class Hall extends BaseNode {
    btnAuthorize = null;
    onLoad () {
        super.onLoad();
    }
    start(){
        app.uiBaseEvent.emit('reqGuanKaInfo');
    }
    onEnable() {
        super.onEnable();
        
    }
    onDisable(){
        super.onDisable();
    }

    createAuthorizeBtn(btnNode: cc.Node) {
        //如果已经授权就return
        if (false) {
            return;
        }
        let btnSize = cc.size(btnNode.width, btnNode.height);
        let frameSize = cc.view.getFrameSize();
        let winSize = cc.director.getWinSize();
        //适配不同机型来创建微信授权按钮
        let left = (winSize.width * 0.5 + btnNode.x - btnSize.width * 0.5) / winSize.width * frameSize.width;
        let top = (winSize.height * 0.5 - btnNode.y - btnSize.height * 0.5) / winSize.height * frameSize.height;
        let width = btnSize.width / winSize.width * frameSize.width;
        let height = btnSize.height / winSize.height * frameSize.height;

        this.btnAuthorize = window['wx'].createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: left,
                top: top,
                width: width,
                height: height,
                lineHeight: 0,
                backgroundColor: '',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });
        this.btnAuthorize.onTap(this.onClickAuthorize.bind(this));
    }

    onClickAuthorize(userData){
        console.log('getUserInfo---res===', userData);
        
    }

}