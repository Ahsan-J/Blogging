import { BaseModel } from "@/common/entity/base.entity";
import { User } from "@/modules/user/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Blog } from "@/modules/blog/blog.entity";

@Entity()
export class Comment extends BaseModel{

    @OneToOne(() => User)
    commenter: User;

    @Column()
    comment: string;

    @ManyToOne(() => Comment, comment => comment.replies)
    parent: string;

    @OneToMany(() => Comment, comment => comment.parent)
    replies: Comment;

    @ManyToOne(() => User)
    likes: User[];

    @ManyToOne(() => Blog, (blog) => blog.comments, {nullable: true})
    blog: Blog;
}