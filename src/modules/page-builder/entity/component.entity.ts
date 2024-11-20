import { BaseModel } from "@/common/entity/base.entity";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";
import { Column, Entity } from "typeorm";
import { ComponentCategory, ComponentStatus } from "../page.enum";

const bitwiseOperator = new BitwiseOperator<ComponentStatus>();

@Entity()
export class Component extends BaseModel {

    @Column()
    name: string;

    @Column()
    category: ComponentCategory;

    @Column()
    thumbnail: string;

    @Column({ unique: true })
    identifier: string;

    @Column()
    description: string;

    get isActive(): boolean {
        return bitwiseOperator.hasValue(this.status, ComponentStatus.ACTIVE)
    }

    set isActive(value: boolean) {
        if(value) {
            this.status = bitwiseOperator.setValue(this.status, ComponentStatus.ACTIVE)
        } else {
            this.status = bitwiseOperator.removeValue(this.status, ComponentStatus.ACTIVE)
        }
    }
}