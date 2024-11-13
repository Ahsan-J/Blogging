import { IsNotEmpty, IsString } from "class-validator";
import { User } from "@/modules/user/user.entity";

export class ActivateUserBody {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    id: User['id']
}
