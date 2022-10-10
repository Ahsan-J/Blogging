import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Blog } from "./blog.entity";
import { CreateBlog } from './blog.dto';
import { User } from "../user/user.entity";
import { BlogStatus } from "./blog.enum";
import moment from "moment";

@Injectable()
export class BlogService{

    constructor(
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>,
      ) { }

    async getBlogs(options: FindManyOptions<Blog>):Promise<[Blog[], number]> {
        return await this.blogRepository.findAndCount(options);
    }

    async createBlog(newBlog: CreateBlog, author: User, banner: Express.Multer.File): Promise<Blog> {
        return await this.blogRepository.save(({
            author,
            title: newBlog.title,
            content: newBlog.content,
            description: newBlog.description,
            status: BlogStatus.Published,
        }))
    }

    async getBlogById(id: string): Promise<Blog> {
        return await this.blogRepository.findOne({
            where: {id},
            relations: ['author', 'likes', 'unlikes', 'comments'],
        });
    }

    async deleteBlog(blog: Blog): Promise<Blog> {
        blog.deleted_at = moment().toISOString();
        return this.blogRepository.save(blog);
    }
}