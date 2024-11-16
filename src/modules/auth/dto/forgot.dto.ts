import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { User } from "@/modules/user/user.entity";

export class ForgotPasswordRequest {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email']
}
