import { IsOptional } from "class-validator";
import { User } from "../user.entity";

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