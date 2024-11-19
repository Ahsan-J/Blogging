import { User } from "../user.entity";

export class UserResponse {

    constructor(user: User){
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.isAdmin = user.isAdmin;
        this.profile = user.profile;
        this.linkedin = user.linkedin;
        this.github = user.github;
        this.bio = user.bio;
        this.website = user.website;
        this.createdAt = user.createdAt;    
        this.isActive = user.isActive;
    }

    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    profile: string;
    linkedin: string;
    github: string;
    isActive: boolean;
    bio: string;
    website: string;
    createdAt: Date;
}

