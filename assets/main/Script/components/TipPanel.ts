import BasePanel from '../base/BasePanel';
const {ccclass, property} = cc._decorator;

@ccclass
export default class TipPanel extends BasePanel {
    @property(cc.RichText)
    tipText: cc.RichText = null;
    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Node)
    yesBtnNode:cc.Node = null;
    @property(cc.Node)
    noBtnNode:cc.Node = null;

    // @property([cc.SpriteFrame])
    // btnFrames:cc.SpriteFrame[]= [];

    CallFunConfirm = null;
    CallFunCancel = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
    }
    onEnable(){
        super.onEnable();

    }

    //注意：如果msg是object，则必须有content属性
    show(msg:string|object,callFunConfirm:Function = null,callFunCancel:Function = null){        
        this.initDetail(msg);
        
        this.CallFunConfirm = callFunConfirm;
        this.CallFunCancel = callFunCancel;
    }

    private initDetail(args){
        this.tipText.string = '<color=#855627>'+ (args.content||args)+'</c>';        
        this.title.string = args.title||'提示';
        //是否是确认框（只有一个确定按钮）
        if (args.isConfirm) {
            this.noBtnNode.active = false;
            this.yesBtnNode.x = 0;
        }else{
            this.noBtnNode.active = true;
            this.yesBtnNode.x = 140;
            this.noBtnNode.x = -140;
        }

        // if (args.isVideo) {
        //     //是否是看广告的确认框
        //     this.yesBtnNode.getComponent(cc.Sprite).spriteFrame = this.btnFrames[1];
        // } else {
        //     this.yesBtnNode.getComponent(cc.Sprite).spriteFrame = this.btnFrames[0];
        // }
    }

    hide(){
        this.node.destroy();
    }

    onClickConfirm(){
        super.onClickClose();
        if (this.CallFunConfirm && typeof this.CallFunConfirm === 'function') {
            this.CallFunConfirm();
        }
    }

    onClickClose(){
        super.onClickClose();
        if (this.CallFunCancel && typeof this.CallFunCancel === 'function') {
            this.CallFunCancel();
        }
    }
    // update (dt) {}
}
