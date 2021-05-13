import BaseNode from "../Script/base/BaseNode";

const {ccclass, property} = cc._decorator;
const OriPx = 85;
@ccclass
export default class HeadNode extends BaseNode {
    @property(cc.Sprite)
    face: cc.Sprite = null;
    @property(cc.SpriteFrame)
    defaultFace:cc.SpriteFrame = null;

    init(avatarUrl){
        if (!avatarUrl || avatarUrl == '') {
            this.setDefaultFace();
            return;
        }

        cc.assetManager.loadRemote(avatarUrl, (err, texture:cc.Texture2D) => {
            if (err) {
                console.log('err_face========', err);
                this.setDefaultFace();
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

    initDetailView(){
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = this.name.substring(this.name.indexOf('<') + 1, this.name.indexOf('>'));
        eventHandler.handler = 'onClickHead' // 绑定回调方法名称
        let btn = this.node.addComponent(cc.Button);
        btn.clickEvents.push(eventHandler);
    }

    onClickHead(){
        
    }
    // update (dt) {}
}
