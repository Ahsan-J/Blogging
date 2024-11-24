import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Blog } from "./entities/blog.entity";
import { CreateBlog } from './dto/create-blog.dto';
import { User } from "@/modules/user/user.entity";
import { PaginateData, PaginatedFindParams, PaginationMeta } from "@/common/dto/pagination.dto";
import { BlogResponse } from "./dto/blog-response.dto";
import { BlogRepository } from "./blog.repository";
import { InvalidInstanceofException } from "@/common/exceptions/instanceof.exception";
import { BlogListItem } from "./dto/blog-listing-item.dto";

@Injectable()
export class BlogService {

    private logger = new Logger()

    constructor(
        @InjectRepository(Blog)
        private blogRepository: BlogRepository,
    ) { }

    async getBlogs(options: PaginatedFindParams<Blog>): Promise<PaginateData<BlogListItem>> {

        // validation check to make sure only instances are allowed
        if (!(options instanceof PaginatedFindParams)) throw new InvalidInstanceofException("PaginatedFindParams")

        const [result, count] = await this.blogRepository.findAndCount(options.toFindOption());

        const meta = new PaginationMeta(count, options.page, options.pageSize);

        const blogResponseList = [];

        for (const blog of result) {
            blogResponseList.push(await new BlogListItem().lazyFetch(blog))
        }

        return new PaginateData(blogResponseList, meta)
    }

    async createBlog(newBlog: CreateBlog, author: User, banner: Express.Multer.File): Promise<BlogResponse> {
        const blog = await this.blogRepository.create({
            author,
            title: newBlog.title,
            content: newBlog.content,
            description: newBlog.description,
        });

        this.logger.log(banner)

        blog.isActive = true
        blog.isPublished = true

        const savedBlog = await this.blogRepository.save(blog);
        return await new BlogResponse().lazyFetch(savedBlog)
    }

    async getBlogById(id: string): Promise<BlogResponse> {
        const blog = await this.blogRepository.createQueryBuilder('blog')
            .where("blog.id=:id", { id })
            .leftJoin('blog.likes', 'user.like_blogs')
            .loadRelationCountAndMap('blog.likes_count', 'blog.likes')
            .leftJoin('blog.comments', 'comment.blog')
            .loadRelationCountAndMap('blog.comments_count', 'blog.comments')
            .leftJoinAndSelect("blog.author", "user")
            .printSql()
            .getOne()

        if (!blog) throw new Error

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

        const [result, count] = await this.blogRepository.createQueryBuilder("blog")
            .leftJoinAndSelect("blog.likes", "user")
            .where("blog.id = :id", { id: blogId })
            .getManyAndCount();

        const meta = new PaginationMeta(count, options.page, options.pageSize);
        const blogResponseList = []

        for (const blog of result) {
            blogResponseList.push(await new BlogResponse().lazyFetch(blog))
        }

        return new PaginateData(blogResponseList, meta)
    }

}