import { IsNotEmpty, IsString } from "class-validator";

export class ActivateUserBody {
    @IsNotEmpty()
    @IsString()
    code: string;
}
