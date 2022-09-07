import { BaseModel } from "src/helper/model";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Log extends BaseModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    file_path: string;

    @Column({nullable: true})
    data: string;

    @Column()
    route: string;
}