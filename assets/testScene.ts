import { _decorator, Component, find, instantiate, Node, Prefab, sp, Sprite } from 'cc';
import { e_RoleState, RoleNode } from './RoleNode';
const { ccclass, property } = _decorator;

@ccclass('testScene')
export class testScene extends Component {
    @property(Prefab)
    public prefab: Prefab = null;
    start() {
        this.initPanel();
    }
    initPanel() {
        let content = find("ScrollView/view/content", this.node);
        for (let i = 0; i < 10; i++) {
            let item = instantiate(this.prefab);
            content.addChild(item);
            let roleComp = item.getChildByName("roleNode").getComponent(RoleNode)
            let dressingList:number[] = [] 
            for (let j = 0; j < 7; j++) {
                dressingList.push(Math.ceil(Math.random()*10));
            }
            roleComp.setDressingList(dressingList)
            roleComp.setRoleState(e_RoleState.Dance2)
        }
    }

}


