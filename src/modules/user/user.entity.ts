import { BaseModel } from "../../helper/model";
import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { UserRole } from "./user.enum";
import { nanoid } from "nanoid";
import { Blog } from "../blog/blog.entity";

@Entity()
export class User extends BaseModel {
    
    @PrimaryColumn()
    id: string = nanoid();

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column({default: UserRole.Standard})
    role: UserRole;

    @Column()
    profile: string;

    @Column({ default: null, nullable: true})
    linkedin: string;

    @OneToMany(() => Blog, blog => blog.author)
    blogs: Blog[];

    @ManyToMany(() => Blog,blog => blog.likes)
    like_blogs: Blog[];

    @ManyToMany(() => User, user => user.followers)
    following: User[];

    @ManyToMany(() => User, user => user.following)
    followers: User[];
}