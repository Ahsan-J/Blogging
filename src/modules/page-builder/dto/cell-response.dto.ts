import { ObjectType } from "@/common/types/collection.type";
import { Cell } from "../entity/cell.entity";
import { RowResponse } from "./row-response.dto";
import { ComponentResponse } from "./component-response.dto";

export class CellResponse {
    async lazyFetch(cell: Cell) {
        this.attributes = cell.attributes
        this.isActive = cell.isActive

        for(const row of await cell.rows) {
            this.rows.push(await new RowResponse().lazyFetch(row))
        }

        for(const component of await cell.components) {
            this.components.push(await new ComponentResponse().lazyFetch(component))
        }

        return this;
    }

    constructor(cell?: Cell) {
        if(!cell) return this;

        this.rows = cell.rows.map(r => new RowResponse(r))
        this.attributes = cell.attributes
        this.isActive = cell.isActive
        this.components = cell.components.map(pc => new ComponentResponse(pc))
    }

    rows: Array<RowResponse> = [];
    attributes?: ObjectType;
    components: Array<ComponentResponse> = [];
    isActive: boolean
}