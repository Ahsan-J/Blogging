import { nanoid } from "nanoid";
import { BaseModel } from "../../../helper/model";
import { User } from "../../../modules/user/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Blog } from "../blog.entity";

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