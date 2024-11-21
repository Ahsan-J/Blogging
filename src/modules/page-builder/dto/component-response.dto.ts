import { Component } from "../entity/component.entity";
import { ComponentCategory } from "../page.enum";

export class ComponentResponse {
    constructor(component: Component) {
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
    category: ComponentCategory;
    createdAt: Date;
}