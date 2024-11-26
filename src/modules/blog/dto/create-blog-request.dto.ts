import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateBlogRequest {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ type: 'string', format: 'binary', name: "cover", required: false })
    @IsOptional()
    cover?: Express.Multer.File
}