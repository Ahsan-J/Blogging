import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blog } from "./blog.entity";
import { CreateBlog } from './blog.dto';
import { User } from "../user/user.entity";
import { BlogStatus } from "./blog.enum";
import moment from "moment";
import { ListOptions } from "src/helper/model";

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>,
    ) { }

    async getBlogs(options: ListOptions): Promise<[Blog[], number]> {

        const blogsQuery = await this.blogRepository.createQueryBuilder('blog')
            .where(options.filters)
            .limit(options.pageSize)
            .offset((options.page - 1) * options.pageSize)
            .orderBy(options.sorts);

        return await blogsQuery.getManyAndCount();
    }

    async createBlog(newBlog: CreateBlog, author: User, banner: Express.Multer.File): Promise<Blog> {
        const blog = await this.blogRepository.create({
            author,
            title: newBlog.title,
            content: newBlog.content,
            description: newBlog.description,
            status: BlogStatus.Published,
        });
        return await this.blogRepository.save(blog);
    }

    async getBlogById(id: string): Promise<Blog> {
        return await this.blogRepository.createQueryBuilder('blog')
            .where("blog.id=:id", { id })
            .leftJoin('blog.likes', 'user.like_blogs')
            .loadRelationCountAndMap('blog.likes_count', 'blog.likes')
            .leftJoin('blog.comments', 'comment.blog')
            .loadRelationCountAndMap('blog.comments_count', 'blog.comments')
            .leftJoinAndSelect("blog.author", "user")
            .printSql()
            .getOne()
    }

    async toggleLike(user: User, blog: Blog) {
        const queryBlog = await this.blogRepository.createQueryBuilder("blog")
            .where("blog.id = :id", { id: blog.id })
            .innerJoinAndSelect("blog.likes", "user", "user.id = :userId", { userId: user.id })
            .getOne()

        if (queryBlog && queryBlog.likes.some(u => u.id == user.id)) {
            return await this.blogRepository.createQueryBuilder().relation("likes").of(blog).remove(user)
        } else {
            return await this.blogRepository.createQueryBuilder().relation("likes").of(blog).add(user)
        }
    }

    async likeBlog(user: User, blog: Blog) {
        const queryBlog = await this.blogRepository.createQueryBuilder("blog")
            .where("blog.id = :id", { id: blog.id })
            .innerJoinAndSelect("blog.likes", "user", "user.id = :userId", { userId: user.id })
            .getOne()
        if (!queryBlog) {
            return await this.blogRepository.createQueryBuilder().relation("likes").of(blog).add(user)
        }
    }

    async unlikeBlog(user: User, blog: Blog) {
        return await this.blogRepository.createQueryBuilder().relation("likes").of(blog).remove(user)
    }

    async deleteBlog(blog: Blog): Promise<Blog> {
        blog.deleted_at = moment().toISOString();
        return this.blogRepository.save(blog);
    }

    async getBlogLikes(blogId: Blog['id'], options: ListOptions): Promise<[any[], number]> {
        
        const [blog, count] = await this.blogRepository.createQueryBuilder("blog")
            .leftJoinAndSelect("blog.likes", "user")
            .where("blog.id = :id", {id: blogId})
            .getManyAndCount();

        return [blog, count]; 
    }
}