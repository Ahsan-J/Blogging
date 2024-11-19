import { nanoid } from "nanoid";
import { BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseModel {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @Column({default: 1})
    protected status: number = 1;

    @Column({ type: 'timestamp', nullable: true })
    public updatedAt: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    public deletedAt: Date | null; 

    @BeforeInsert()
    private setCreatedAt() {
        this.createdAt = new Date();
        if (!this.id) {
            this.id = nanoid(); // If the `id` is not set, generate a UUID
        }
    }

    @BeforeUpdate()
    private setUpdatedAt() {
        this.updatedAt = new Date();
    }
}