import { app } from "../Script/app";
import BaseNode from "../Script/base/BaseNode";
import {CellStatus } from "../Script/GameDefine";

const {ccclass, property} = cc._decorator;
const MoveY = 800;
@ccclass
export default class IdiomCell extends BaseNode {
    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Sprite)
    cell: cc.Sprite = null;

    @property(cc.SpriteFrame)
    unselectFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    selectFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    fixedFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    normalFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    wrongFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    rightFrame: cc.SpriteFrame = null;
    
    orginPos:cc.Vec3 = null;
    isSelect = false;
    state = CellStatus.Normal;
    data:{str:string,pos:number,isBlank:boolean} = null;//原始数据
    girdWidth = 9;
    girdHeight = 9;
    wordData = null;//填入的数据
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
    }
    onEnable(){
        super.onEnable();
        this.onEventUI('SelectCell',(pos)=>{
            if (pos!=this.data.pos) {
                this.setSelect(false);
            }
        });
        this.onEventUI('onClickWord',(data)=>{
            if (this.isSelect) {
                this.setCell(data);
            }
        });
    }

    initCell (cell:{str:string,pos:number,isBlank:boolean},width:number,height:number) {
        this.data = cell;
        this.girdWidth = width;
        this.girdHeight = height;

        let line = Math.floor(this.data.pos/this.girdWidth); 
        let column = this.data.pos%this.girdHeight;

        this.orginPos = app.IdiomPos[line][column];

        this.node.x = this.orginPos.x;
        this.node.y = this.orginPos.y+MoveY;

        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node).delay((width-line)*0.3)
            .to(0.4, { y: this.orginPos.y + MoveY*0.2})
            .to(0.1, { y: this.orginPos.y}, { easing: 'backOut' })
            .start();

        if (cell.isBlank) {
            this.isSelect = false;
            this.getComponent(cc.Sprite).spriteFrame = this.unselectFrame;

            this.state = CellStatus.Empty;
            this.cell.spriteFrame = null;
            
        }else{
            this.label.string = cell.str;
            this.cell.spriteFrame = this.fixedFrame;
            this.state = CellStatus.Fixed;
        }
    }
    setSelect(isSelect = true){
        if (isSelect) {
            if (this.state == CellStatus.Fixed || this.state == CellStatus.Right) {
                return;
            }
            app.uiViewEvent.emit('SelectCell',this.data.pos);
            
            if (this.label.string != '') {
                app.uiViewEvent.emit('BackCell',this.wordData);
            }

            this.getComponent(cc.Sprite).spriteFrame = this.selectFrame;
            this.cell.spriteFrame = null;
            this.label.string = '';
            this.state = CellStatus.Empty;
        }else{
            this.getComponent(cc.Sprite).spriteFrame = this.unselectFrame;
        }
        this.isSelect = isSelect;
    }
    private setCell(data:{index:number,word:string}){
        if (this.label.string != '') {
            app.uiViewEvent.emit('BackCell',this.wordData);
        }
        this.wordData = data;
        this.label.string = data.word;
        this.setState(CellStatus.Normal);
        
        this.judgeComplete();
    }
    setState(state: number = CellStatus.Normal,delay = 0){
        
        switch(state){
            case CellStatus.Wrong:
                if (this.state == CellStatus.Normal) {
                    this.state = state;
                    this.cell.spriteFrame = this.wrongFrame;
                }
                cc.Tween.stopAllByTarget(this.node);
                cc.tween(this.node).set({ angle:0})
                    .to(0.1, { angle:10})
                    .to(0.2, { angle:-10})
                    .to(0.2, { angle:10})
                    .to(0.2, { angle:-10})
                    .to(0.1, { angle:0}, { easing: 'backOut' })
                    .start();
                break;
            case CellStatus.Right:
                this.cell.spriteFrame = this.rightFrame;
                this.setSelect(false);
                this.state = state;
                cc.Tween.stopAllByTarget(this.node);
                cc.tween(this.node).set({ scale:1})
                    .delay(delay)
                    .to(0.2, { scale:1.2})
                    .to(0.1, { scale:1}, { easing: 'backOut' })
                    .start();
                break;
            case CellStatus.Normal:
            default: 
                this.cell.spriteFrame = this.normalFrame;
                this.state = state;
                break;
        }
    }
    judgeComplete(){
        let lineIdiomCells = this.getLineCells();
        let columnIdiomCells = this.getColumnCells();
        if (lineIdiomCells && lineIdiomCells.length > 1) {//成语最少要2个字
            app.uiViewEvent.emit('IdiomComplete',lineIdiomCells);
        }
        if (columnIdiomCells && columnIdiomCells.length > 1) {//成语最少要2个字
            app.uiViewEvent.emit('IdiomComplete',columnIdiomCells);
        }
    }
    private getLineCells():cc.Component[]{
        let line = Math.floor(this.data.pos/this.girdWidth); 
        let column = this.data.pos%this.girdHeight;
        let IdiomCells = [this];
        let lineTop = line-1;
        let lineBottom = line+1;
       
        let topCell = this.judgeExist(lineTop,column);
        while (topCell&&lineTop>=0) {//遍历到空格子为止
            if (topCell.label.string == '') {
                return [];//还没填字，未完成
            }
            IdiomCells.unshift(topCell);
            lineTop--;
            topCell = this.judgeExist(lineTop, column);
        }
        let bottomCell = this.judgeExist(lineBottom, column);
        while (bottomCell&&lineBottom<this.girdHeight) {//遍历到空格子为止
            if (bottomCell.label.string == '') {
                return [];//还没填字，未完成
            }
            IdiomCells.push(bottomCell);
            lineBottom++;
            bottomCell = this.judgeExist(lineBottom, column);
        }
        return IdiomCells;
    }
    private getColumnCells():cc.Component[]{
        let line = Math.floor(this.data.pos/this.girdWidth); 
        let column = this.data.pos%this.girdHeight;
        let IdiomCells = [this];
        let columnLeft = column-1;
        let columnRight = column+1;
       
        let leftCell = this.judgeExist(line,columnLeft);
        while (leftCell&&columnLeft>=0) {
            if (leftCell.label.string == '') {
                return [];
            }
            IdiomCells.unshift(leftCell);
            columnLeft--;
            leftCell = this.judgeExist(line, columnLeft);
        }
        let rightCell = this.judgeExist(line, columnRight);
        while (rightCell&&columnRight<this.girdWidth) {
            if (rightCell.label.string == '') {
                return [];
            }
            IdiomCells.push(rightCell);
            columnRight++;
            rightCell = this.judgeExist(line, columnRight);
        }
        return IdiomCells;
    }
    private judgeExist(line,column){
        let pos = this.girdHeight*line+column;
        let idiomCells = this.node.parent.getComponentsInChildren('IdiomCell');
        for (let index = 0; index < idiomCells.length; index++) {
            if (idiomCells[index].data.pos == pos) {
                return idiomCells[index];
            }
        }
        return false;
    }
    private onClick(){
        this.setSelect(true);
    }
    // update (dt) {}
}
