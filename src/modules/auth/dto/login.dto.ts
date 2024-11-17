import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { User } from "@/modules/user/user.entity";
import { UserResponse } from "@/modules/user/dto/user-response.dto";

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

export class LoginResponse extends UserResponse {

    constructor(
        user: User,
        public readonly accessToken: string,
    ) {
        super(user);
    }

}