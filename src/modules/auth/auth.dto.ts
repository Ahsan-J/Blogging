import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { User } from "../user/user.entity";

export class LoginBody {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email'];

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: User['password'];
}

export class RegisterBody {
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
}

export class ResetPasswordBody {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email']

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    confirm_password: string;
}

export class ForgotPasswordBody {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email']
}

export class ActivateUserBody {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    id: User['id']
}