import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { User } from "@/modules/user/user.entity";


export class RegisterUserRequest {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email'];

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: User['name'];

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: User['password'];

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    confirm_password: User['password'];

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
