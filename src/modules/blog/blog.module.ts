import { Module, OnApplicationBootstrap } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogController } from "./blog.controller";
import { Blog } from "./blog.entity";
import { BlogService } from "./blog.service";
import { CommentModule } from "@/modules/comment/comment.module";
import { BlogRepository } from "./blog.repository";
import { UserModule } from "../user/user.module";
import { BlogDataSeeder } from "./blog.seeder";

@Module({
    controllers: [BlogController],
    imports: [
        TypeOrmModule.forFeature([Blog]),
        CommentModule,
        UserModule, // this module is needed for AuthGuard to work properly
    ],
    providers: [BlogService, BlogRepository, BlogDataSeeder],
    exports: [BlogService],
})
export class BlogModule implements OnApplicationBootstrap{
    constructor(public readonly seeder: BlogDataSeeder){}

    onApplicationBootstrap() {
        this.seeder.seed();
    }
}