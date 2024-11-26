import { BaseModel } from "@/common/entity/base.entity";
import { User } from "@/modules/user/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Blog } from "@/modules/blog/entities/blog.entity";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";
import { CommentStatus } from "../blog.enum";

@Entity()
export class Comment extends BaseModel {

    private readonly bitwiseOperator = new BitwiseOperator<CommentStatus>();

    @OneToOne('User')
    commenter: User;

    @Column()
    comment: string;

    @ManyToOne('Comment', 'replies')
    parent: Comment;

    @OneToMany('Comment', 'parent')
    replies: Array<Comment>;

    @ManyToOne('User')
    likes: User[];

    @ManyToOne('Blog', 'comments', { nullable: true })
    blog: Blog;

    get isActive(): boolean {
        return this.bitwiseOperator.hasValue(this.status, CommentStatus.ACTIVE)
    }

    set isActive(value: boolean) {
        if (value) {
            this.status = this.bitwiseOperator.setValue(this.status, CommentStatus.ACTIVE)
        } else {
            this.status = this.bitwiseOperator.removeValue(this.status, CommentStatus.ACTIVE)
        }
    }
}