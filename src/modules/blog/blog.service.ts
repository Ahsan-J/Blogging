import { ForbiddenException, Injectable } from "@nestjs/common";
import { Blog } from "./entities/blog.entity";
import { CreateBlogRequest } from './dto/create-blog-request.dto';
import { User } from "@/modules/user/user.entity";
import { PaginateData, PaginatedFindParams, PaginationMeta } from "@/common/dto/pagination.dto";
import { BlogResponse } from "./dto/blog-response.dto";
import { BlogRepository } from "./blog.repository";
import { BlogListItem } from "./dto/blog-listing-item.dto";

@Injectable()
export class BlogService {

    constructor(
        private blogRepository: BlogRepository,
    ) { }

    async getBlogs(options: PaginatedFindParams<Blog>): Promise<PaginateData<BlogListItem>> {

        const [result, count] = await this.blogRepository.findAllActivePublishedBlogs(options);

        const meta = new PaginationMeta(count, options.page, options.pageSize);

        const blogResponseList = [];

        for (const blog of result) {
            blogResponseList.push(await new BlogListItem().lazyFetch(blog))
        }

        return new PaginateData(blogResponseList, meta)
    }

    async getBlogsByUser(options: PaginatedFindParams<Blog>, user: User): Promise<PaginateData<BlogListItem>> {

        const [result, count] = await this.blogRepository.findUserBlogs(options, user);

        const meta = new PaginationMeta(count, options.page, options.pageSize);

        const blogResponseList = [];

        for (const blog of result) {
            blogResponseList.push(await new BlogListItem().lazyFetch(blog))
        }

        return new PaginateData(blogResponseList, meta)
    }

    async createBlog(newBlog: CreateBlogRequest, author: User, cover: Express.Multer.File): Promise<BlogResponse> {
        const blog = await this.blogRepository.create({
            author,
            cover: cover.path,
            title: newBlog.title,
            content: newBlog.content,
            description: newBlog.description,
        });

        blog.isActive = true
        blog.isPublished = true

        await this.blogRepository.save(blog);
        return await new BlogResponse().lazyFetch(blog)
    }

    async draftBlog(newBlog: CreateBlogRequest, author: User, cover: Express.Multer.File): Promise<BlogResponse> {
        const blog = await this.blogRepository.create({
            author,
            cover: cover.path,
            title: newBlog.title,
            content: newBlog.content,
            description: newBlog.description,
        });

        blog.isActive = true
        blog.isPublished = false

        const savedBlog = await this.blogRepository.save(blog);
        return await new BlogResponse().lazyFetch(savedBlog)
    }

    async publishBlog(id: string, user: User): Promise<BlogResponse> {
        const blog = await this.blogRepository.findBlogById(id)
        
        if (blog.author.id !== user.id && !user.isAdmin) {
            throw new ForbiddenException("Unable to perform action on other's blog");
        }

        blog.isPublished = true

        await this.blogRepository.save(blog)

        return new BlogResponse().lazyFetch(blog)
    }

    async unpublishBlog(id: string, user: User): Promise<BlogResponse> {
        const blog = await this.blogRepository.findBlogById(id)
        
        if (blog.author.id !== user.id && !user.isAdmin) {
            throw new ForbiddenException("Unable to perform action on other's blog");
        }

        blog.isPublished = false

        return new BlogResponse().lazyFetch(await this.blogRepository.save(blog))
    }

    async getBlogById(id: string): Promise<BlogResponse> {
        const blog = await this.blogRepository.findBlogById(id)
        return await new BlogResponse().lazyFetch(blog)
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

    async likeBlog(blogId: string, user: User) {
        const queryBlog = await this.blogRepository.createQueryBuilder("blog")
            .where("blog.id = :id", { id: blogId })
            .innerJoinAndSelect("blog.likes", "user", "user.id = :userId", { userId: user.id })
            .getOne()

        if (!queryBlog) {
            return await this.blogRepository.createQueryBuilder().relation("likes").of(queryBlog).add(user)
        }
    }

    async unlikeBlog(blogId: string, user: User) {
        const queryBlog = await this.blogRepository.createQueryBuilder("blog")
            .where("blog.id = :id", { id: blogId })
            .innerJoinAndSelect("blog.likes", "user", "user.id = :userId", { userId: user.id })
            .getOne()

        if (queryBlog) {
            return await this.blogRepository.createQueryBuilder().relation("likes").of(queryBlog).remove(user)
        }
    }

    async deleteBlog(id: string, user: User): Promise<BlogResponse> {
        const blog = await this.blogRepository.findBlogById(id);

        if (blog.author.id !== user.id && !user.isAdmin) {
            throw new ForbiddenException("Unable to perform delete on other's blog");
        }

        blog.deletedAt = new Date();
        blog.isActive = false

        const savedBlog = await this.blogRepository.save(blog);

        return await new BlogResponse().lazyFetch(savedBlog);
    }

    async getBlogLikes(blogId: Blog['id'], options: PaginatedFindParams<Blog>): Promise<PaginateData<BlogResponse>> {

        const [result, count] = await this.blogRepository.findBlogLikes(blogId, options);

        const meta = new PaginationMeta(count, options.page, options.pageSize);
        const blogResponseList = []

        for (const blog of result) {
            blogResponseList.push(await new BlogResponse().lazyFetch(blog))
        }

        return new PaginateData(blogResponseList, meta)
    }

}