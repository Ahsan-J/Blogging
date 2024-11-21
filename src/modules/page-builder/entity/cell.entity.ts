import { BaseModel } from "@/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { CellStatus } from "../page.enum";
import { ObjectType } from "@/common/types/collection.type";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";
import { Row } from "./row.entity";
import { PageComponent } from "./page-component.entity";
import { JsonTransformer } from "@/common/transformer/object.transformer";

const bitwiseOperator = new BitwiseOperator<CellStatus>();

@Entity()
export class Cell extends BaseModel {

    @ManyToOne(() => Row, row => row.cells)
    @JoinColumn({name: 'parent_row_id'})
    parentRow: Row

    @OneToMany(()=> Row, row => row.parentCell, { lazy: true })
    @JoinColumn()
    rows: Array<Row>;

    @Column({ type: "text", default: null, transformer: new JsonTransformer() })
    attributes?: ObjectType;

    @OneToMany(() => PageComponent, component => component.parent, { lazy: true })
    @JoinColumn()
    components: Array<PageComponent>;

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