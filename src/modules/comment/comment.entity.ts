import { nanoid } from "nanoid";
import { BaseModel } from "@/common/entity/base.entity";
import { User } from "../user/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Blog } from "../blog/blog.entity";

@Entity()
export class Comment extends BaseModel{
    @PrimaryColumn()
    id: string = nanoid();

    @OneToOne(() => User)
    commentor: User;

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