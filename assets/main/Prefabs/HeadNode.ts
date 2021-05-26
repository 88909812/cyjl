import { app } from "../Script/app";
import BaseNode from "../Script/base/BaseNode";
import { Message } from "../Script/net/NetDefine";
import { PackageBase } from "../Script/net/PackageBase";

const {ccclass, property} = cc._decorator;
const OriPx = 86;
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
        if (this.face.spriteFrame == this.defaultFace) {
            return;
        }
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
        app.platform.updateUserInfo();
        
        
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
