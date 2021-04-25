const ExceedItemCount = 1;
const {ccclass, property} = cc._decorator;

@ccclass
export default class ScrollViewEx extends cc.Component {
    @property(cc.Prefab)
    prefab:cc.Prefab = null;

    @property(cc.Integer)
    private spacingY: number = 0;


    curPageIndex = 1;
    scrollview:cc.ScrollView = null;
    content:cc.Node = null;

    nodePool:cc.NodePool = new cc.NodePool();

    itemHeight: number = 1;
    visibleHeight: number = 1;
    lastStartIndex:number = -1;

    originY:number = 0;

    curProcessTime = 0;

    itemDatas = [];
    filledIds: { [key: number]: number } = {};

    onLoad () {
        this.scrollview = this.getComponent(cc.ScrollView);
        this.content = this.scrollview.content;

        let item = this.nodePool.get()||cc.instantiate(this.prefab);
        this.itemHeight = item.height;
        this.nodePool.put(item);
        

        this.node.on(cc.Node.EventType.SIZE_CHANGED,()=>{
            cc.log('SIZE_CHANGED');
            this.originY = this.content.parent.height * this.content.parent.anchorY;
            this.content.y = this.originY;
            this.visibleHeight = Math.ceil(this.content.parent.height / (this.itemHeight + this.spacingY));
        });
    }


    addDatas(data = []) {
        if (!data||data.length<=0) {
            return;
        }

        for (let index = 0; index < data.length; index++) {
            this.itemDatas.push(data[index])
        }
        let height = this.itemDatas.length * (this.itemHeight + this.spacingY);
        this.content.height = height > this.content.parent.height ? height : this.content.parent.height;

        //widget更新之后需要对齐
        if (this.curPageIndex == 1) {
            this.originY = this.content.parent.height * this.content.parent.anchorY;
            this.content.y = this.originY;
            this.visibleHeight = Math.ceil(this.content.parent.height / (this.itemHeight + this.spacingY));
            this._updateView(0);
        }
        //******************** */
    }
    updateItemInfo(){
        this.content.children.forEach(itemNode => {
            let index = itemNode['_tag'];
            let data = this.itemDatas[index];
            let component = itemNode['_components'][0];
            if (component && component.init) {
                component.init(data, index);
            }
        });
    }
    _updateView(startIndex){
        let itemStartIndex = startIndex;
        // 比实际元素多ExceedItemCount*2个.
        let itemEndIndex = itemStartIndex + this.visibleHeight + ExceedItemCount;
        const totalCount = this.itemDatas.length;
        if (itemStartIndex >= totalCount) {
            cc.log('itemStartIndex >= totalCount and return');
            return;
        }

        if (itemEndIndex > totalCount) {
            itemEndIndex = totalCount;
        }

        // 回收需要回收的元素位置.向上少收ExceedItemCount个.向下少收ExceedItemCount个.
        const recyles = this._getRecycleItems(itemStartIndex - ExceedItemCount, itemEndIndex);
        recyles.forEach(item => {
            this.nodePool.put(item);
        })

        // 查找需要更新的元素位置.
        const updates = this._findUpdateIndex(itemStartIndex, itemEndIndex)

        // 更新相应位置.
        for (let index of updates) {
            this._addOneItem(index);
        }
    }
    _addOneItem(posIndex){
        let itemNode = this.nodePool.get()||cc.instantiate(this.prefab);
        itemNode['_tag'] = posIndex;
        this.filledIds[posIndex] = posIndex;
        itemNode.setPosition(0, -itemNode.height * (0.5 + posIndex) - this.spacingY * posIndex);
        itemNode.parent = this.content;

        let data = this.itemDatas[posIndex];
        let component = itemNode['_components'][0];
        if (component && component.init) {
            component.init(data,posIndex);
        }else{
            cc.log('数据无法初始化，请检查脚本是否挂在第一个，是否有init(data)方法');
        }
    }
    _getRecycleItems(beginIndex: number, endIndex: number): cc.Node[] {
        const children = this.content.children;
        const recycles = []
        children.forEach(item => {
            if (item["_tag"] < beginIndex || item["_tag"] > endIndex) {
                recycles.push(item);
                delete this.filledIds[item["_tag"]];
            }
        })
        return recycles;
    }
    _findUpdateIndex(itemStartIndex: number, itemEndIndex: number): number[] {
        const d = [];
        for (let i = itemStartIndex; i < itemEndIndex; i++) {
            if (this.filledIds.hasOwnProperty(i)) {
                continue;
            }
            d.push(i);
        }
        return d;
    }

    _checkNeedUpdate(): number {
        let scroll = this.content.y - this.content.parent.height * this.content.parent.anchorY;
        let itemStartIndex = Math.floor(scroll / (this.itemHeight + this.spacingY));
        if (itemStartIndex < 0) {
            itemStartIndex = 0;
        }
        if (this.lastStartIndex != itemStartIndex) {
            this.lastStartIndex = itemStartIndex;
            return itemStartIndex;
        }

        return -1;
    }

    clearAllItem(){
        for(let i = this.content.childrenCount - 1; i >= 0; i--) {
            let node = this.content.children[i];
            this.nodePool.put(node);
        }
        this.lastStartIndex = -1;
        this.filledIds = {};
        this.itemDatas = [];
        this.curPageIndex = 1;
    }
    onDisable(){
        this.clearAllItem();
    }
    protected update(dt) {
        const startIndex = this._checkNeedUpdate();
        if (startIndex >= 0) {
            this._updateView(startIndex);
        }
    }
}
