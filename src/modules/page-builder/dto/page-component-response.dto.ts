import { ObjectType } from "@/common/types/collection.type";
import { PageComponent } from "../entity/page-component.entity";
import { ComponentResponse } from "./component-response.dto";

export class PageComponentResponse {

    async lazyFetch(pageComponent: PageComponent): Promise<PageComponentResponse>{
        this.name = pageComponent.name;
        this.component = new ComponentResponse(await pageComponent.component)
        this.attributes = pageComponent.attributes;
        this.isActive = pageComponent.isActive;
        return this;
    }

    constructor(pageComponent?: PageComponent) {
        if(!pageComponent) return this;
        this.name = pageComponent.name;
        this.component = new ComponentResponse(pageComponent.component)
        this.attributes = pageComponent.attributes;
        this.isActive = pageComponent.isActive;
    }

    name: string;
    component: ComponentResponse;
    attributes?: ObjectType;
    isActive: boolean 
}