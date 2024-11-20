import { BaseModel } from "@/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { RowStatus } from "../page.enum";
import { ObjectType } from "@/common/types/collection.type";
import { MetaKeywordTransformer } from "@/common/transformer/meta-keyword.transformer";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";
import { Cell } from "./cell.entity";
import { Page } from "./page.entity";
import { JsonTransformer } from "@/common/transformer/object.transformer";

const bitwiseOperator = new BitwiseOperator<RowStatus>();

@Entity()
export class Row extends BaseModel {

    @Column()
    title: string;

    @Column()
    layout: string;

    @OneToMany(() => Cell, cell => cell.parentRow)
    @JoinColumn()
    cells: Array<Cell>;

    @ManyToOne(() => Cell, cell => cell.rows)
    @JoinColumn({name: 'parent_cell_id'})
    parentCell: Cell;

    @ManyToOne(() => Page, page => page.rows)
    @JoinColumn()
    page: Page;

    @Column({ type: "text", default: null, transformer: new JsonTransformer() })
    attributes: ObjectType;

    @Column({type: 'text', transformer: new MetaKeywordTransformer()})
    meta: ObjectType<string>;

    @Column()
    password: string;

    get isActive(): boolean {
        return bitwiseOperator.hasValue(this.status, RowStatus.ACTIVE)
    }

    set isActive(value: boolean) {
        if(value) {
            this.status = bitwiseOperator.setValue(this.status, RowStatus.ACTIVE)
        } else {
            this.status = bitwiseOperator.removeValue(this.status, RowStatus.ACTIVE)
        }
    }
}