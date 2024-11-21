import { IsString, IsNotEmpty, IsIn, IsNumber, IsUrl } from "class-validator";
import { ComponentCategory } from "../page.enum";
import { Column } from "typeorm";

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
