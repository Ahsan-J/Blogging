import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { User } from "@/modules/user/user.entity";

export class LoginRequest {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email'];

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: User['password'];
}

export class LoginResponse {

}