import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { User } from "@/modules/user/user.entity";


export class ResetPasswordRequest {
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