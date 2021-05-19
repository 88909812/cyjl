
const {ccclass, property} = cc._decorator;

@ccclass
export default class MaskEx extends cc.Mask {
    onLoad () {
    }
    init(rects:cc.Rect[]){
        let stencil:cc.Graphics = this['_graphics'];
        stencil.clear();
        for (let index = 0; index < rects.length; index++) {
            const rect = rects[index];
            stencil.rect(rect.x,rect.y,rect.width,rect.height);
            stencil.fillColor = cc.Color.WHITE;
            stencil.fill();
        }
    }
    add(rects:cc.Rect[]){
        let stencil:cc.Graphics = this['_graphics'];
        for (let index = 0; index < rects.length; index++) {
            const rect = rects[index];
            stencil.rect(rect.x,rect.y,rect.width,rect.height);
            stencil.fillColor = cc.Color.WHITE;
            stencil.fill();
        }
    }
    // update (dt) {}
}
