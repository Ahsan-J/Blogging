import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "./comment.entity";
import { CommentService } from "./comment.service";

@Module({
    providers: [CommentService],
    exports: [CommentService],
    imports: [TypeOrmModule.forFeature([Comment])]
})
export class CommentModule{}
