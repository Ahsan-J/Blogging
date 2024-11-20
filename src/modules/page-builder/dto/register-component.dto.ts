import { IsString, IsNotEmpty, IsIn, IsNumber, IsUrl } from "class-validator";
import { ComponentCategory } from "../page.enum";
import { Column } from "typeorm";
import { Component } from "../entity/component.entity";

export class RegisterComponentRequest {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsIn([ComponentCategory.ATOM, ComponentCategory.MOLECULE, ComponentCategory.ORGANISM])
    category: ComponentCategory;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    thumbnail: string;

    @Column()
    identifier: string;

    @Column()
    description: string;
}

export class ComponentResponse {
    constructor(
        component: Component
    ) {
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