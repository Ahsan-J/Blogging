import { BaseModel } from "@/common/entity/base.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { UserRole, UserStatus } from "./user.enum";
import { nanoid } from "nanoid";
import { Blog } from "../blog/blog.entity";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";

@Entity()
export class User extends BaseModel {

    private readonly userRoleBitwiseOperator = new BitwiseOperator(UserRole)
    private readonly userStatusBitwiseOperator = new BitwiseOperator(UserStatus)
    
    @PrimaryColumn()
    id: string = nanoid();

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column()
    role: UserRole;

    @Column()
    profile: string;

    @Column({ default: null, nullable: true})
    linkedin: string;

    @Column({ default: null, nullable: true})
    github: string;

    @Column({ default: null, nullable: true})
    bio: string;
    
    @Column({ default: null, nullable: true})
    website: string;

    @OneToMany(() => Blog, blog => blog.author)
    blogs: Blog[];

    @ManyToMany(() => Blog,blog => blog.likes)
    like_blogs: Blog[];

    @ManyToMany(() => User, user => user.followers)
    following: User[];

    @ManyToMany(() => User, user => user.following)
    followers: User[];

    get isActive(): boolean {
        return this.userStatusBitwiseOperator.hasValue(this.status, UserStatus.Active)
    }

    set isActive(value: boolean) {
        
    }

    get isBlocked(): boolean { 
        return this.userStatusBitwiseOperator.hasValue(this.status, UserStatus.Blocked)
    }

    get isAdmin(): boolean {
        return this.userRoleBitwiseOperator.hasValue(this.role, UserRole.Admin)
    }

    set isAdmin(value: boolean) {
        
    }
}