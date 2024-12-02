import { nanoid } from "nanoid";
import { BeforeInsert, BeforeSoftRemove, BeforeUpdate, Column, PrimaryGeneratedColumn, BeforeRecover } from "typeorm";

export class BaseModel {

    @PrimaryGeneratedColumn('uuid')
    public id: string = nanoid();

    @Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP', name: 'created_at' })
    public createdAt: Date = new Date();

    @Column({default: 1})
    protected status: number = 1;

    @Column({ type: 'timestamp', nullable: true, name: 'updated_at' })
    public updatedAt?: Date;

    @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
    public deletedAt?: Date; 

    @BeforeInsert()
    setCreatedAt() {
        this.createdAt = new Date();
    }

    @BeforeUpdate()
    setUpdatedAt() {
        this.updatedAt = new Date();
    }

    @BeforeSoftRemove()
    setDeletedAt() {
        this.deletedAt = new Date();
    }

    @BeforeRecover()
    setRecovery() {
        this.deletedAt = undefined;
    }
}