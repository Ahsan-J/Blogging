import { Column } from "typeorm";

export abstract class BaseModel {
    @Column()
    created_at: string = new Date().toISOString();

    @Column({default: 1})
    status: number;

    @Column({nullable: true})
    updated_at: string = new Date().toISOString();

    @Column({nullable: true, default: null})
    deleted_at: string;
}