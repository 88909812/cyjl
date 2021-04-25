import BaseNode from '../base/BaseNode';
const {ccclass, property} = cc._decorator;

@ccclass
export default class MessageNode extends BaseNode {

    @property(cc.Label)
    label: cc.Label = null;

    show(msg:string|number){
        this.node.active = true;
        cc.Tween.stopAllByTarget(this.node);
        if (typeof msg == "string") {
            this.label.string = msg;
        }else{
            this.label.string = this.getMsgByCode(msg);
        }
        
        cc.tween(this.node)
        .set({opacity:0,y:-30})
        .to(0.3, { opacity: 255, y:30}).delay(2).to(0.2,{opacity: 0})
        .call(()=>{
            this.hide();
        })
        .start();
    }
    getMsgByCode(code:number):string{
        let str = '';
        switch (code) {
            default:str = '错误码：'+code;break;
        }
        return str;
    }

    // update (dt) {}
}
