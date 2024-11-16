import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { User } from "../user.entity";

export class CreateUserRequest {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email'];

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: User['name'];

    @IsOptional()
    @IsNotEmpty()
    role?: User['role'];

    @IsOptional()
    @IsNotEmpty()
    linkedin: string;

    @IsOptional()
    @IsNotEmpty()
    github: string;

    @IsOptional()
    @IsNotEmpty()
    website: string;
    
    @IsOptional()
    @IsNotEmpty()
    @MinLength(6)
    bio: string;
}