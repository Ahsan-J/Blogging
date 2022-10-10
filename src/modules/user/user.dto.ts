import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "../user/user.entity";
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

export class UpdateUser {
    @IsOptional()
    name: User['name'];

    @IsOptional()
    linkedin: User['linkedin'];

    @IsOptional()
    role: User['role'];

    @IsOptional()
    status: User['status'];
}