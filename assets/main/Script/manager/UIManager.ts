import { app } from "../app";

export default class UIManager {

    /**
     * 缓存已经创建的ui脚本对象
     */
    _uiMap = {};

    _currZIndex = 20;

    private static instance: UIManager;

    private constructor() {
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING,  this._beforeSceneLoading,   this);
    }
    
	static getIns(): UIManager {
		if(!UIManager.instance) {
			UIManager.instance = new UIManager();
		}
		return UIManager.instance;
    }
    
    /**
     * 根据prefabPath去加载ui预制体
     * @param prefabPath ui路径(prefabs文件夹下)
     * @param callback 加载成功后的回调
     */
    loadPrefab(prefabPath : string, callback : Function = null) {
        app.waitingPanel.show();
        cc.resources.load('prefabs/'+prefabPath, cc.Prefab, (err : any, prefab : cc.Prefab) => {
            app.waitingPanel.hide();
            if(err) {
                cc.error('UIManager::loadUI '+prefabPath, err);
            } else {
                callback && callback(prefab);
            }
        });
    }

    /**
     * ui Prefab 默认第一个Component必须是控制ui的脚本组件，并且必须实现show接口。 
     * 根据ui路径显示ui。使用这个接口，ui节点会放置在最上层。  
     * 层级控制，新打开的ui要显示在最上层
     * @param uiUrl ui路径
     * @param args 可选参数列表
     */
    showUI(uiUrl: string, ...args: any) {
        //检测UI是否存在
        if(!this._hasProperty(this._uiMap, uiUrl)) {
            let self = this;
            this.loadPrefab(uiUrl, (prefab : cc.Prefab) => {
                if(!self._hasProperty(self._uiMap, uiUrl)) {
                    let node = cc.instantiate(prefab);
                    node.parent = cc.Canvas.instance.node;
                    //默认读取第一个Component
                    if(node['_components'].length==0){
                        cc.error('请把启动脚本挂在根节点上');
                        return;
                    }
                    self._uiMap[uiUrl] = node['_components'][0]; 
                }
                //加载到UI后直接再调用一次showUI，执行检测到UI的逻辑
                args.unshift(uiUrl);
                self.showUI.apply(self, args);
            });
        } else {
            let uiNode = this._uiMap[uiUrl].node;
            if (cc.isValid(uiNode)) {
                if (this._uiMap[uiUrl].show) {
                    if (args.length === 0) {
                        this._uiMap[uiUrl].show();
                    }
                    else {
                        this._uiMap[uiUrl].show.apply(this._uiMap[uiUrl], args);
                    }
                }
                uiNode.zIndex = this._currZIndex++;
                uiNode.active = true;
            }
            else { // ui的node意外被移除后重新加载ui
                this._uiMap[uiUrl] = null;
                args.unshift(uiUrl);
                this.showUI.apply(this, args);
            }
        }
    }
    /**
     * 根据ui名称找到ui脚本对象
     * @param uiUrl UI路径
     */
    getUIComponent(uiUrl : string) {
        if(this._hasProperty(this._uiMap, uiUrl)) {
            return this._uiMap[uiUrl];
        }
        return null;
    }

    /**
     * 清除ui缓存
     * @param uiUrl ui的路径
     */
    _clearUICache(uiUrl : string) {
        if(this._hasProperty(this._uiMap, uiUrl)) {
            this._uiMap[uiUrl] = null;
        }
    }

    /**
     * 切换场景的时候触发这个回调，将当前场景中打开的ui都关闭掉
     */
    _beforeSceneLoading() {
        cc.log('UIManager::loadScene');
        for(let uiUrl in this._uiMap) {
            if(this._hasProperty(this._uiMap, uiUrl)) {
                if (this._uiMap[uiUrl].node) {
                    this._uiMap[uiUrl].node.destroy();
                }
                this._clearUICache(uiUrl);
            }
        }
        this._uiMap = {};
        this._currZIndex = 20;
    }

    /**
     * 判断对象身上是否包含指定属性并且这个属性不为null或undefined，不会去原型链上进行查找
     * @param obj 对象
     * @param propertyName 属性名称
     * @return obj上有指定属性返回true，否则返回false
     */
    _hasProperty(obj : Object, propertyName : string) : boolean {
        return obj[propertyName] && obj[propertyName] != void 0;
    }
}
