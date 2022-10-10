import { nanoid } from "nanoid";
import { BaseModel } from "src/helper/model";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Contacts extends BaseModel {
    
    @PrimaryColumn()
    id: string = nanoid();
    
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    subject: string;

    @Column()
    message: string;

}