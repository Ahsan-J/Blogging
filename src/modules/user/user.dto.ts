import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { User } from "@/modules/user/user.entity";
import { UserRole } from "./user.enum";

export class ChangeRoleBody {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email'];

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: User['role'];
}