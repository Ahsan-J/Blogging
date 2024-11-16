import { BaseModel } from "@/common/entity/base.entity";
import { Column, Entity } from "typeorm";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";
import { ContactStatus } from "./contact.enum";

@Entity()
export class Contacts extends BaseModel {
    private readonly contactBitwiseOperator = new BitwiseOperator(ContactStatus)
    
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    subject: string;

    @Column()
    message: string;

    get isRead(): boolean { return this.contactBitwiseOperator.hasValue(this.status, ContactStatus.READ)}
    
    set isRead(value: boolean) { 
        if(value) {
            this.status = this.contactBitwiseOperator.setValue(this.status, ContactStatus.READ)
        } else {
            this.status = this.contactBitwiseOperator.removeValue(this.status, ContactStatus.READ)
        }
    }

}