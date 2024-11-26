import { BaseModel } from "@/common/entity/base.entity";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";
import { UserRole, UserStatus } from "./user.enum";
import { Blog } from "@/modules/blog/entities/blog.entity";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";


const userRoleBitwiseOperator = new BitwiseOperator<UserRole>()
const userStatusBitwiseOperator = new BitwiseOperator<UserStatus>()

@Entity()
export class User extends BaseModel {

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

    @OneToMany("Blog", "author", { lazy: true, cascade: ["soft-remove"] })
    blogs: Blog[];

    @ManyToMany("Blog","likes", { lazy: true, cascade: ["soft-remove"] })
    like_blogs: Blog[];

    @ManyToMany("User", "followers", { lazy: true, cascade: ["soft-remove"] })
    following: User[];

    @ManyToMany("User", "following", { lazy: true, cascade: ["soft-remove"] })
    followers: User[];

    get isActive(): boolean {
        return userStatusBitwiseOperator.hasValue(this.status, UserStatus.ACTIVE)
    }

    set isActive(value: boolean) {
        if(value) {
            this.status = userStatusBitwiseOperator.setValue(this.status, UserStatus.ACTIVE)
        } else {
            this.status = userStatusBitwiseOperator.removeValue(this.status, UserStatus.ACTIVE)
        }
    }

    get isBlocked(): boolean { 
        return userStatusBitwiseOperator.hasValue(this.status, UserStatus.BLOCKED)
    }

    set isBlocked(value: boolean) {
        if(value) {
            this.status = userStatusBitwiseOperator.setValue(this.status, UserStatus.BLOCKED)
        } else {
            this.status = userStatusBitwiseOperator.removeValue(this.status, UserStatus.BLOCKED)
        }
    }

    get isAdmin(): boolean {
        return userRoleBitwiseOperator.hasValue(this.role, UserRole.ADMIN)
    }
}