import { IsDefined, IsEmail, IsString, MinLength } from "class-validator";

export class ContactPortfolioForm {
    @IsDefined()
    @IsString()
    @MinLength(3)
    name: string;

    @IsDefined()
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsDefined()
    message: string;

    @IsString()
    @IsDefined()
    subject: string;
}