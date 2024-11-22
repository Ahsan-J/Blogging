import { ObjectType } from "@/common/types/collection.type";
import { Component } from "../entity/component.entity";
import { ComponentCategory } from "../page.enum";

export class ComponentResponse {

    async lazyFetch(pageComponent: Component): Promise<ComponentResponse>{
        this.name = pageComponent.name;
        this.identifier = pageComponent.identifier;
        this.attributes = pageComponent.attributes;
        this.isActive = pageComponent.isActive;
        this.description = pageComponent.description;
        this.thumbnail = pageComponent.thumbnail;
        this.category = pageComponent.category;
        this.createdAt = pageComponent.createdAt;
        return this;
    }

    constructor(component?: Component) {
        if(!component) return this;
        this.id = component.id;
        this.name = component.name;
        this.identifier = component.identifier;
        this.description = component.description;
        this.thumbnail = component.thumbnail;
        this.category = component.category;
        this.isActive = component.isActive;
        this.createdAt = component.createdAt;
    }

    id: string;
    name: string;
    identifier: string;
    isActive: boolean;
    description: string;
    thumbnail: string;
    attributes?: ObjectType;
    category: ComponentCategory;
    createdAt: Date;
}