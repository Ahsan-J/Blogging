import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogController } from "./blog.controller";
import { Blog } from "./blog.entity";
import { BlogService } from "./blog.service";
import { CommentModule } from "../comment/comment.module";

@Module({
    controllers: [BlogController],
    imports: [
        TypeOrmModule.forFeature([Blog]),
        CommentModule,
    ],
    exports: [BlogService],
    providers: [BlogService],
})
export class BlogModule{}