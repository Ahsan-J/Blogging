import { BaseModel } from "@/common/entity/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany } from "typeorm";
import { CellStatus } from "../page.enum";
import { ObjectType } from "@/common/types/collection.type";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";
import { Row } from "./row.entity";
import { Component } from "./component.entity";
import { JsonTransformer } from "@/common/transformer/object.transformer";

const bitwiseOperator = new BitwiseOperator<CellStatus>();

@Entity({ name: 'cell' })
export class Cell extends BaseModel {

    @ManyToOne(() => Row, row => row.cells)
    @JoinColumn({name: 'parent_row_id'})
    parentRow: Row

    @OneToMany(()=> Row, row => row.parentCell, { lazy: true })
    @JoinTable()
    rows: Array<Row>;

    @Column({ type: "text", default: null, transformer: new JsonTransformer() })
    attributes?: ObjectType;

    @OneToMany(() => Component, component => component.parent, { lazy: true })
    @JoinTable()
    components: Array<Component>;

    get isActive(): boolean {
        return bitwiseOperator.hasValue(this.status, CellStatus.ACTIVE)
    }

    set isActive(value: boolean) {
        if(value) {
            this.status = bitwiseOperator.setValue(this.status, CellStatus.ACTIVE)
        } else {
            this.status = bitwiseOperator.removeValue(this.status, CellStatus.ACTIVE)
        }
    }
}