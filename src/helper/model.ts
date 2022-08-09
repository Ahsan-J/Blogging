import { Column } from "typeorm";

export abstract class BaseModel {
    @Column()
    created_at: string;

    @Column()
    status: number;

    @Column({nullable: true})
    updated_at: string;

    @Column({nullable: true})
    deleted_at: string;
}

export class AppResponse<T = any> {
    
    status: number;
    data: T;
    message: string;
    code: string;

    constructor(data: T, code = "", status = 200, message = "Success") {
        this.status = status;
        this.message = message;
        this.code = code;
        this.data = data;
    }
}