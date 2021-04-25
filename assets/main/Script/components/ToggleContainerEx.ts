
const {ccclass, property} = cc._decorator;

@ccclass
export default class ToggleContainerEx extends cc.Component {
    toggleContainer:cc.ToggleContainer = null;


    onLoad () {
        this.toggleContainer = this.getComponent(cc.ToggleContainer);
        let callbackName = 'onCheckToggle';
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = 'ToggleContainerEx';
        eventHandler.handler = callbackName;

        this.toggleContainer.checkEvents.push(eventHandler);

        this.toggleContainer.toggleItems.forEach(toggle => {
            if (toggle.node&&toggle.node.active) {
                toggle.node.getChildByName('Background').active = !toggle.isChecked;
            }
        });
    }
    onCheckToggle(event:cc.Toggle){
        //cc.log('ToggleContainerEx--',event);
        this.commonEvent(event);
    }

    commonEvent(event:cc.Toggle){
        this.toggleContainer.toggleItems.forEach(toggle => {
            if (toggle.node&&toggle.node.active) {
                toggle.node.getChildByName('Background').active = !toggle.isChecked;
            }
        });
        event.node.getChildByName('Background').active = false;
        event.isChecked = true;
    }
}
