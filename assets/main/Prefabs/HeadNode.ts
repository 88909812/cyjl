import { app } from "../Script/app";
import BaseNode from "../Script/base/BaseNode";
import { Message } from "../Script/net/NetDefine";
import { PackageBase } from "../Script/net/PackageBase";

const {ccclass, property} = cc._decorator;
const OriPx = 85;
@ccclass
export default class HeadNode extends BaseNode {
    @property(cc.Sprite)
    face: cc.Sprite = null;
    @property(cc.SpriteFrame)
    defaultFace:cc.SpriteFrame = null;

    btnAuthorize = null;

    init(avatarUrl){
        this.setDefaultFace();
        if (!avatarUrl || avatarUrl == '') {
            return;
        }

        cc.assetManager.loadRemote(avatarUrl,{ext: '.png'}, (err, texture:cc.Texture2D) => {
            if (err) {
                console.log('err_face========', err);
                return;
            }
            this.face.spriteFrame = new cc.SpriteFrame(texture);
            this.face.node.scale = OriPx / this.face.node.width;
        });
    }
    setDefaultFace(){
        this.face.spriteFrame = this.defaultFace;
        this.face.node.scale = 1;
    }


    initClickHandler(){
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = this.name.substring(this.name.indexOf('<') + 1, this.name.indexOf('>'));
        eventHandler.handler = 'onClickHead' // 绑定回调方法名称
        let btn = this.node.addComponent(cc.Button);
        btn.clickEvents.push(eventHandler);
    }

    onClickHead(){
        wx.getSetting({
            success:(res)=> {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: (res)=> {
                            console.log(res);
                            let userData = res.userInfo;
                            if (userData) {
                                this.uploadUserInfo(userData);
                            }
                        }
                    })
                }
            }
        });
        
    }

    initAuthButton(){
        wx.getSetting({
            success:(res)=> {
                console.log('getSetting--',res);
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称

                } else {
                    if (this.btnAuthorize) {
                        return;
                    }
                    let worldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
                    let btnSize = cc.size(this.node.width, this.node.height);
                    let frameSize = cc.view.getFrameSize();
                    let winSize = cc.winSize;
                    let ratio = frameSize.width/winSize.width;
                    //适配不同机型来创建微信授权按钮
                    let left = (worldPos.x - btnSize.width * 0.5)*ratio;
                    let top = (winSize.height - worldPos.y - btnSize.height * 0.5)*ratio;
                    let width = btnSize.width *ratio;
                    let height = btnSize.height*ratio;

                    this.btnAuthorize = wx.createUserInfoButton({
                        type: 'text',
                        text: '',
                        style: {
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                            backgroundColor: ''
                        }
                    });
                    this.btnAuthorize.onTap((res) => {
                        console.log('getUserInfo===', res);
                        let userData = res.userInfo;
                        if (userData) {
                            this.uploadUserInfo(userData);
                        }
                    });
                }
            }
        });
    }

    uploadUserInfo(userData) {
        if (this.btnAuthorize) {
            this.btnAuthorize.destroy();
            this.btnAuthorize = null;
        }
        
        let msg = new app.PB.message.SendMPUserInfo();
        msg.name = userData.nickName;
        msg.avatar = userData.avatarUrl;
        msg.sex = userData.gender;
        let pack = new PackageBase(Message.SendMPUserInfo);
        pack.d(msg).to(app.sever);
    }
    onDisable(){
        super.onDisable();
        if (this.btnAuthorize) {
            this.btnAuthorize.destroy();
            this.btnAuthorize = null;
        }
    }
    // update (dt) {}
}
