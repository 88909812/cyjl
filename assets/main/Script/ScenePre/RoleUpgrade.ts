import { app } from '../app';
import BaseNode from '../base/BaseNode';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class RoleUpgrade extends BaseNode {
    @property(cc.Node)
    oldRole:cc.Node = null;
    @property(cc.Node)
    newRole:cc.Node = null;

    @property(cc.Node)
    light:cc.Node = null;
    onLoad () {
        super.onLoad();
    }
    onEnable() {
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
    }
    show(oldLevel,newLevel=null){
        this.light.active = false;
        let armatureOld =  this.oldRole.getComponentInChildren(dragonBones.ArmatureDisplay);
        cc.resources.load('bones/Step'+ oldLevel + '_ske', dragonBones.DragonBonesAsset, (err, bone:dragonBones.DragonBonesAsset) => {
            cc.resources.load('bones/Step' + oldLevel + '_tex', dragonBones.DragonBonesAtlasAsset, (err, asset:dragonBones.DragonBonesAtlasAsset) => {
                armatureOld.dragonAsset = bone;
                armatureOld.dragonAtlasAsset = asset;
                armatureOld.armatureName = 'Armature';
                armatureOld.playAnimation('newAnimation', 0);
            });
        });

        if (newLevel != null) {
            let armatureNew = this.newRole.getComponentInChildren(dragonBones.ArmatureDisplay);
            cc.resources.load('bones/Step' + newLevel + '_ske', dragonBones.DragonBonesAsset, (err, bone: dragonBones.DragonBonesAsset) => {
                cc.resources.load('bones/Step' + newLevel + '_tex', dragonBones.DragonBonesAtlasAsset, (err, asset: dragonBones.DragonBonesAtlasAsset) => {
                    armatureNew.dragonAsset = bone;
                    armatureNew.dragonAtlasAsset = asset;
                    armatureNew.armatureName = 'Armature';
                    armatureNew.playAnimation('newAnimation', 0);
                });
            });

            this.playAni();
        }
    }

    playAni(){
        const moveY = 700;
        const moveTime = 3;
        let oldRoleBone = this.oldRole.getChildByName('bone');
        let newRoleBone = this.newRole.getChildByName('bone');
        cc.Tween.stopAllByTarget(this.oldRole);
        cc.Tween.stopAllByTarget(this.newRole);
        cc.Tween.stopAllByTarget(oldRoleBone);
        cc.Tween.stopAllByTarget(newRoleBone);
        cc.Tween.stopAllByTarget(this.light);

        this.oldRole.y = 0;
        this.newRole.y = 0;
        oldRoleBone.y = 0;
        newRoleBone.y = 0;

        cc.tween(this.oldRole).to(moveTime, { y: moveY }).start();
        cc.tween(oldRoleBone).to(moveTime, { y: -moveY }).start();
        cc.tween(this.newRole).to(moveTime, { y: moveY }).start();
        cc.tween(newRoleBone).to(moveTime, { y: -moveY }).call(()=>{
            this.light.active = true;
            cc.tween(this.light).by(2, { angle:360 }).call(()=>{
                this.light.active = false;
                app.uiViewEvent.emit('RoleUpgradeFinish');
            }).start();
        }).start();
    }
}