import { BaseModel } from "@/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ComponentStatus } from "../page.enum";
import { ObjectType } from "@/common/types/collection.type";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";
import { Cell } from "./cell.entity";
import { JsonTransformer } from "@/common/transformer/object.transformer";
import { Component } from "./component.entity";

const bitwiseOperator = new BitwiseOperator<ComponentStatus>();

@Entity()
export class PageComponent extends BaseModel {

    @ManyToOne(() => Cell)
    @JoinColumn({name: 'parent_cell_id'})
    parent: Cell

    @Column()
    name: string;

    @ManyToOne(() => Component, { lazy: true })
    @JoinColumn({ name: "component_id" })
    component: Component;

    @Column({ type: 'text', default: null, transformer: new JsonTransformer() })
    attributes?: ObjectType;

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