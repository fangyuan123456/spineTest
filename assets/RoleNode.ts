import { _decorator, Camera, Component, director, find, gfx, ImageAsset, instantiate, Material, Node, renderer, RenderTexture, sp, Sprite, SpriteFrame, Texture2D, tween, UITransform, v2, v3, Vec2, Vec3, view } from 'cc';

const { ccclass, property } = _decorator;
export enum e_RoleState {
    Wait,
    Wait1,
    Dance1,
    Dance2,
    Dance3,
    Dance4,
    Victory
}
@ccclass('RoleNode')
export class RoleNode extends Component {
    dressingList: number[];
    maskSp:Node
    targetSpine:sp.Skeleton
    passes:renderer.Pass

    isHandBack:boolean = true;
    maskTransformTHander:number
    maxPosHander:number
    minPosHander:number
    handBackHander:number
    protected onLoad(): void {
        this.maskSp = find("mask/head",this.node)
        this.targetSpine = find("part2",this.node).getComponent(sp.Skeleton)
    }
    start() {
        this.passes = this.targetSpine.customMaterial.passes[0]
   
        this.maskTransformTHander =  this.passes.getHandle('maskTransformT')
        this.maxPosHander =  this.passes.getHandle('maxPos')
        this.minPosHander =  this.passes.getHandle('minPos')
        this.handBackHander = this.passes.getHandle('handBack')
    }
    setDressingList(dressingList: number[]) {
        this.dressingList = dressingList
        this.updateDressingShow();
    }
    updateDressingShow() {
        let isBlack = this.dressingList[6] == 1;
        let nameList = ["hair/hair", "shirt/shirt", "skirt/skirt", "accessories/acc", "shoe/shoe", "face/face"]
        let haveBlackList = [0, 1, 2]
        for (let i = 0; i < 6; i++) {
            let isShowBlack = isBlack && haveBlackList.indexOf(i) >= 0;
            let spine = find("part" + (i + 1), this.node).getComponent(sp.Skeleton);
            spine.node.active = true;
            if (this.dressingList[i]) {
                let blackStr = isShowBlack ? "_black" : ""
                let skinName = nameList[i] + blackStr + this.dressingList[i]
                spine.setSkin(skinName)
            } else {
                spine.node.active = false;
            }

        }
    }
    setRoleState(state: e_RoleState) {
        let aniNameMap = {
            [e_RoleState.Wait]: "idle_battle",
            [e_RoleState.Wait1]: "congrat2",
            [e_RoleState.Victory]: "congrat3",
            [e_RoleState.Dance1]: "dance1",
            [e_RoleState.Dance2]: "dance2",
            [e_RoleState.Dance3]: "dance3",
            [e_RoleState.Dance4]: "dance4"

        }
        for (let i = 0; i < 6; i++) {
            let spine = find("part" + (i + 1), this.node).getComponent(sp.Skeleton);
            if(spine){
                let curAniName = spine.animation;
                spine.setMix(curAniName,aniNameMap[state],0.3);
                spine.setAnimation(0, aniNameMap[state], true);
            }
        }
        find("mask",this.node).getComponent(sp.Skeleton).setAnimation(0, aniNameMap[state], true);
        
        let handBackList:boolean[] = [true,false,true,false,true,false,false];
        this.isHandBack = handBackList[state];
    }
    setUniform(){
        let mat4 = this.maskSp.worldMatrix.clone().invert();
        let size = this.maskSp.getComponent(UITransform);
        //@ts-ignore
        this.targetSpine._cleanMaterialCache();
        // 设置本地坐标范围
        const x_min = -size.width / 2;
        const x_max = size.width / 2;
        const y_min = -size.height / 2;
        const y_max = size.height / 2;
        this.passes.setUniform(this.maskTransformTHander,mat4);
        this.passes.setUniform(this.maxPosHander,v2(x_max, y_max));
        this.passes.setUniform(this.minPosHander,v2(x_min, y_min));
        this.passes.setUniform(this.handBackHander,this.isHandBack?1:0);
    }
    update(deltaTime: number) {
        this.setUniform();
    }
}


