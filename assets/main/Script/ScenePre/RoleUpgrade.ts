import { app } from '../app';
import BaseNode from '../base/BaseNode';
import { Message } from '../net/NetDefine';
import { PackageBase } from '../net/PackageBase';
const {ccclass, property} = cc._decorator;
@ccclass
export default class RoleUpgrade extends BaseNode {
    @property(dragonBones.ArmatureDisplay)
    role:dragonBones.ArmatureDisplay = null;
    @property(dragonBones.ArmatureDisplay)
    bornArmature:dragonBones.ArmatureDisplay = null;

    @property(cc.Node)
    light:cc.Node = null;
    onLoad () {
        super.onLoad();
        this.bornArmature.on(dragonBones.EventObject.COMPLETE,()=>{
            this.bornArmature.node.active = false;
            this.role.node.active = true;
            this.light.active = true;
            cc.tween(this.light).by(2, { angle:360 }).call(()=>{
                this.light.active = false;
                app.uiViewEvent.emit('RoleUpgradeFinish');
            }).start();
        });
    }
    onEnable() {
        super.onEnable();

    }
    onDisable(){
        super.onDisable();
    }
    show(oldRoleData,newRoleData=null){
        this.light.active = false;

        if (newRoleData == null) {
            cc.resources.load('bones/Step'+ (oldRoleData+1) + '_ske', dragonBones.DragonBonesAsset, (err, bone:dragonBones.DragonBonesAsset) => {
                cc.resources.load('bones/Step' + (oldRoleData+1)  + '_tex', dragonBones.DragonBonesAtlasAsset, (err, asset:dragonBones.DragonBonesAtlasAsset) => {
                    this.role.dragonAsset = bone;
                    this.role.dragonAtlasAsset = asset;
                    this.role.armatureName = 'Armature';
                    this.role.playAnimation('newAnimation', 0);
                });
            });
        }else {
            this.playBorn();
            cc.resources.load('bones/Step' + (newRoleData+1)  + '_ske', dragonBones.DragonBonesAsset, (err, bone: dragonBones.DragonBonesAsset) => {
                cc.resources.load('bones/Step' + (newRoleData+1) + '_tex', dragonBones.DragonBonesAtlasAsset, (err, asset: dragonBones.DragonBonesAtlasAsset) => {
                    this.role.dragonAsset = bone;
                    this.role.dragonAtlasAsset = asset;
                    this.role.armatureName = 'Armature';
                    this.role.playAnimation('newAnimation', 0);
                });
            });
            
            app.oldRoleData++;
            //this.playAni();
        }
    }
    playBorn(){
        this.role.node.active = false;
        this.bornArmature.node.active = true;
        this.bornArmature.playAnimation('newAnimation',2);
    }
    // playAni(){
    //     const moveY = 700;
    //     const moveTime = 3;
    //     let oldRoleBone = this.oldRole.getChildByName('bone');
    //     let newRoleBone = this.newRole.getChildByName('bone');
    //     cc.Tween.stopAllByTarget(this.oldRole);
    //     cc.Tween.stopAllByTarget(this.newRole);
    //     cc.Tween.stopAllByTarget(oldRoleBone);
    //     cc.Tween.stopAllByTarget(newRoleBone);
    //     cc.Tween.stopAllByTarget(this.light);

    //     this.oldRole.y = 0;
    //     this.newRole.y = 0;
    //     oldRoleBone.y = 0;
    //     newRoleBone.y = 0;

    //     cc.tween(this.oldRole).to(moveTime, { y: moveY }).start();
    //     cc.tween(oldRoleBone).to(moveTime, { y: -moveY }).start();
    //     cc.tween(this.newRole).to(moveTime, { y: moveY }).start();
    //     cc.tween(newRoleBone).to(moveTime, { y: -moveY }).call(()=>{
    //         this.light.active = true;
    //         cc.tween(this.light).by(2, { angle:360 }).call(()=>{
    //             this.light.active = false;
    //             app.uiViewEvent.emit('RoleUpgradeFinish');
    //         }).start();
    //     }).start();
    // }
}