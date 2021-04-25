const ButtonSpotStr = 'btn_';
const ToggleSpotStr = 'toggle';
const EditBoxSpotStr = 'edit_';
const {ccclass, property} = cc._decorator;

@ccclass
export default class EventBind extends cc.Component {
    cacheMap = cc.js.createMap();

    onLoad () {
        let uiRoot = this.node;
        let preNodes = [];//预处理的节点数组
        let path = '';
        this.ergodicAllNodes(uiRoot, preNodes, this.cacheMap, path);
        this.disposeNodes(preNodes, uiRoot['_components'][0]);
    }

    //遍历所有节点
    ergodicAllNodes(node, preNodes, cacheMap, path) {
        for(let i = 0; i < node.childrenCount; i++) {
            let child:cc.Node = node.children[i];
            if (child.getComponent('EventBind')) {
                continue;
            }
            if (child.name.indexOf(ButtonSpotStr) >= 0 || child.name.indexOf(ToggleSpotStr) >= 0
            || child.name.indexOf(EditBoxSpotStr) >= 0) {
                preNodes.push(child);
                if (path.length > 0) {
                    cacheMap[child.name] = path + '/' + child.name;
                } else {
                    cacheMap[child.name] = child.name;
                }
            }

            if(child.childrenCount <= 0) {
                continue;
            }
            //name以“$”开头的不遍历。(规避一些不需要用到的节点，以提升性能)
            //例如：$btn_close,下还有一堆子节点，那么这些子节点不会遍历
            if (child.name[0] === '$') {
                continue;
            }
            
            let newPath = path.length > 0 ? path + '/' + node.children[i].name : node.children[i].name;
            this.ergodicAllNodes(node.children[i], preNodes, cacheMap, newPath);
        }
    }
    
    //处理需要预处理的节点
    disposeNodes(nodes, target) {
        for(let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            let isBtn = node.name.indexOf(ButtonSpotStr) >= 0;
            let isToggle = node.name.indexOf(ToggleSpotStr) >= 0;
            let isEditBox = node.name.indexOf(EditBoxSpotStr) >= 0;
            if (isBtn) {
                this.bindBtnEvent(node, target);
            }else if (isToggle) {
                this.bindToggleEvent(node, target);
            }else if (isEditBox) {
                this.bindEditBoxEvent(node, target);
            }
        }
    }

    bindBtnEvent (btnNode, target) {
        let componentName = target.name.substring(target.name.indexOf('<') + 1, target.name.indexOf('>'));

        let btnComp = btnNode.getComponent(cc.Button);
        if (!btnComp) {
            btnComp = btnNode.addComponent(cc.Button);
            btnComp.target = btnNode;
            btnComp.transition = cc.Button.Transition.SCALE;
            btnComp.zoomScale = 0.92;
        }

        if (!target || target.node.name.indexOf(componentName) < 0) {
            cc.error('请把主脚本(名字和节点一样的脚本)挂载到节点的最上面：', target.node.name);
            return;
        }
        if (!btnComp.clickEvents[0]) {
            let btnName = btnNode.name;
            let callbackName = 'onClick' + btnName.substring(btnName.indexOf(ButtonSpotStr) + ButtonSpotStr.length);
            if (!target[callbackName]) {
                cc.warn(componentName + '缺少函数：' + callbackName+'(event:cc.Button){}');
                return;
            }
            let eventHandler = new cc.Component.EventHandler();
            eventHandler.target = target.node;
            eventHandler.component = componentName;
            eventHandler.handler = callbackName;

            btnComp.clickEvents.push(eventHandler);
        }
    }
    
    bindToggleEvent (toggleNode, target) {
        let componentName = target.name.substring(target.name.indexOf('<') + 1, target.name.indexOf('>'));
        if (!target || target.node.name.indexOf(componentName) < 0) {
            cc.error('请把主脚本(名字和节点一样的脚本)挂载到节点的最上面：',target.node.name);
            return;
        }
        let toggleComp = toggleNode.getComponent(cc.Toggle);
        if (!toggleComp) {
            cc.error('toggle组件需要自己绑定，目前只提供自动绑定事件功能');
            return;
        }
        if (!toggleComp.checkEvents[0]) {
            let toggleName = toggleNode.name;
            let callbackName = 'onCheck' + toggleName.substring(toggleName.indexOf(ToggleSpotStr) + ToggleSpotStr.length);
            if (!target[callbackName]) {
                cc.warn(componentName + '缺少函数：' + callbackName+'(event:cc.Toggle){}');
                return;
            }

            let eventHandler = new cc.Component.EventHandler();
            eventHandler.target = target.node;
            eventHandler.component = componentName;
            eventHandler.handler = callbackName;

            toggleComp.checkEvents.push(eventHandler);
        }
    }
    bindEditBoxEvent(editNode, target){
        let componentName = target.name.substring(target.name.indexOf('<') + 1, target.name.indexOf('>'));
        if (!target || target.node.name.indexOf(componentName) < 0) {
            cc.error('请把主脚本(名字和节点一样的脚本)挂载到节点的最上面：',target.node.name);
            return;
        }
        let EditBoxComp = editNode.getComponent(cc.EditBox);
        if (!EditBoxComp) {
            cc.error('EditBox组件需要自己绑定，目前只提供自动绑定事件功能');
            return;
        }
        if (!EditBoxComp.textChanged[0]) {
            let editName = editNode.name;
            let callbackName = 'onChange' + editName.substring(editName.indexOf(EditBoxSpotStr) + EditBoxSpotStr.length);
            if (!target[callbackName]) {
                cc.warn(componentName + '缺少函数：' + callbackName+'(str:string,editbox:cc.EditBox){}');
                return;
            }

            let eventHandler = new cc.Component.EventHandler();
            eventHandler.target = target.node;
            eventHandler.component = componentName;
            eventHandler.handler = callbackName;

            EditBoxComp.textChanged.push(eventHandler);
        }
    }
}
