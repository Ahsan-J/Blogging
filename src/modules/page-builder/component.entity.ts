import { BaseModel } from "@/common/entity/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { ComponentCategory, ComponentStatus } from "./page.enum";
import { ObjectType } from "@/common/types/collection.type";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";
import { Cell } from "./cell.entity";
import { JsonTransformer } from "@/common/transformer/object.transformer";

const bitwiseOperator = new BitwiseOperator<ComponentStatus>();

@Entity()
export class Component extends BaseModel {

    @ManyToOne(() => Cell)
    parent: Cell

    @Column()
    name: string;

    @Column()
    category: ComponentCategory;

    @Column()
    thumbnail: string;

    @Column()
    identifier: string;

    @Column()
    description: string;

    @Column({ type: 'text', default: null, transformer: new JsonTransformer() })
    attributes: ObjectType | null;

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