
import { ObjectType } from "@/common/types/collection.type";
import { Row } from "../entity/row.entity";
import { CellResponse } from "./cell-response.dto";

export class RowResponse {
    constructor(row?: Row) {
        if(!row) return this;
        this.attributes = row.attributes;
        this.cells = row.cells.map(c => new CellResponse(c));
        this.isActive = row.isActive;
    }

    async lazyFetch(row: Row): Promise<RowResponse> {

        this.attributes = row.attributes;
        this.isActive = row.isActive;

        for(const cell of await row.cells) {
            this.cells.push(await new CellResponse().lazyFetch(cell))
        }

        return this
    }

    title: string;
    layout: string;
    cells: Array<CellResponse> = [];
    attributes?: ObjectType;
    isActive: boolean;
}