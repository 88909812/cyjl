import { app } from '../app';
import BaseNode from '../base/BaseNode';
const {ccclass, property} = cc._decorator;

@ccclass
export default class GetReward extends BaseNode {
    @property(cc.Node)
    layer = null;
    // @property(cc.Node)
    // rewardUI = null;
    @property(cc.Prefab)
    rewardItemPrefab = null;

    curIndex = 0;

    nodePool:cc.NodePool = new cc.NodePool();
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
    }

    /**
     * 
     * @param rewards 物品列表
     */
    show(rewards = []) {

        if(rewards instanceof Array) {
            if (!rewards || rewards.length === 0) {
                return;
            }
        }else {
            let name = arguments[0]||0;
            let count = arguments[1]||1;
            let reward = {
                propCount: count,
                propName:name
            }
            this.show([reward]);
            return;
        }

        for (let index = 0; index < rewards.length; index++) {
            const reward = rewards[index];
            let itemNode = this.nodePool.get() || cc.instantiate(this.rewardItemPrefab);
            itemNode.parent = this.layer;
            let item = itemNode._components[0];
            item.init(reward.propName, reward.propCount);
            
            cc.Tween.stopAllByTarget(itemNode);
            itemNode.opacity = 0;
            itemNode.x = 0;
            itemNode.y = 0;
            cc.tween(itemNode).delay(0.4 * this.curIndex)
                .call(() => {
                    this.curIndex--;
                    app.soundManager.playGetReward();
                })
                .to(0.2, { opacity: 255, y: 50 })
                .to(0.2, { y: 100 })
                .delay(0.4)
                .to(0.1, { opacity: 0 })
                .call(() => {
                    this.nodePool.put(itemNode);
                }).start();
            this.curIndex++;
        }
    }
    /**
     * 显示获得的金币
     * @param goldCount 金币数量
     */
    showLingshi(goldCount) {
        let reward = {
            propName: 'lingshi',
            propCount: goldCount,
            
        }
        this.show([reward]);
    }

    showPower(count) {
        let reward = {
            propName: 'power',
            propCount: count,
        }
        this.show([reward]);
    }
}
