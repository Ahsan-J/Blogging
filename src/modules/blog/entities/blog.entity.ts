import { BaseModel } from "@/common/entity/base.entity";
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { User } from "@/modules/user/user.entity";
import { Comment } from "@/modules/blog/entities/comment.entity";
import { BlogStatus } from "../blog.enum";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";

@Entity()
export class Blog extends BaseModel {

    private readonly bitwiseOperator = new BitwiseOperator<BlogStatus>();

    @Index({ fulltext: true })
    @Column()
    title: string;

    @Index({ fulltext: true })
    @Column()
    description: string;

    @Column({ type: "text" })
    content: string;

    @Column({ type: "text", nullable: true })
    cover?: string;

    @ManyToOne('User','blogs', { lazy: true })
    @JoinColumn()
    author: User;

    @ManyToMany('User', 'like_blogs', { lazy: true })
    @JoinTable()
    likes: User[];

    @OneToMany('Comment','blog', { lazy: true })
    @JoinTable()
    comments: Comment[];

    get isActive(): boolean {
        return this.bitwiseOperator.hasValue(this.status, BlogStatus.ACTIVE)
    }

    set isActive(value: boolean) {
        if (value) {
            this.status = this.bitwiseOperator.setValue(this.status, BlogStatus.ACTIVE)
        } else {
            this.status = this.bitwiseOperator.removeValue(this.status, BlogStatus.ACTIVE)
        }
    }

    get isPublished(): boolean {
        return this.bitwiseOperator.hasValue(this.status, BlogStatus.PUBLISH)
    }

    set isPublished(value: boolean) {
        if (value) {
            this.status = this.bitwiseOperator.setValue(this.status, BlogStatus.PUBLISH)
        } else {
            this.status = this.bitwiseOperator.removeValue(this.status, BlogStatus.PUBLISH)
        }
    }

    get isBlocked(): boolean {
        return this.bitwiseOperator.hasValue(this.status, BlogStatus.BLOCKED)
    }

    set isBlocked(value: boolean) {
        if (value) {
            this.status = this.bitwiseOperator.setValue(this.status, BlogStatus.BLOCKED)
        } else {
            this.status = this.bitwiseOperator.removeValue(this.status, BlogStatus.BLOCKED)
        }
    }
}