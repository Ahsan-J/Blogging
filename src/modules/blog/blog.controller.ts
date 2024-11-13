import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { PaginationMeta, PaginationQuery } from "@/common/dto/pagination.dto";
import { Sieve } from "src/common/pipes/sieve.pipe";
import { getStorage } from "src/common/utils/utility";
import { AuthUser } from "../auth/auth.decorator";
import { AuthGuard } from "../../common/guards/auth.guard";
import { User } from "../user/user.entity";
import { UserRole } from "../user/user.enum";
import { CreateBlog } from "./dto/create_blog.dto";
import { Blog } from "./blog.entity";
import { BlogService } from "./blog.service";

@ApiTags('Blog')
@Controller('blog')
export class BlogController {

    constructor(
        private blogService: BlogService,
    ) { }

    @Get()
    async getBlogs(@Query() query: PaginationQuery, @Query('filters', Sieve) filters, @Query('sorts', Sieve) sorts): Promise<Array<Blog> | { meta: PaginationMeta }> {
        const page = parseInt(query.page || '1');
        const pageSize = parseInt(query.pageSize || '10');

        const [data, count] = await this.blogService.getBlogs({
            page,
            pageSize,
            filters,
            sorts 
        });

        const meta = new PaginationMeta(count, page, pageSize);

        return {
            ...data,
            meta
        }
    }

    @Post('create')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('banner', { storage: getStorage('blog_banners') }))
    async createBlog(@Body() body: CreateBlog, @AuthUser() user: User, @UploadedFile() banner: Express.Multer.File): Promise<Blog> {
        return this.blogService.createBlog(body, user, banner);
    }

    @Get(':id')
    async getBlogPost(@Param("id") id: string) {
        return await this.blogService.getBlogById(id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    async deleteBlog(@Param("id") id: string, @AuthUser() user: User) {
        const blog = await this.blogService.getBlogById(id);

        if (blog.author.id !== user.id && !user.isAdmin) {
            throw new ForbiddenException("Unable to perform delete on other's blog");
        }

        this.blogService.deleteBlog(blog);
    }

    @Post(':id/like')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    async likeBlog(@Param("id") id: string, @AuthUser() user: User) {
        const blog = await this.blogService.getBlogById(id);
        return this.blogService.likeBlog(user, blog);
    }

    @Post(':id/unlike')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    async unlikeBlog(@Param("id") id: string, @AuthUser() user: User) {
        const blog = await this.blogService.getBlogById(id);
        return this.blogService.unlikeBlog(user, blog);
    }

    @Get(":id/likes")
    async getPostLikes(@Param("id") id: string, @Query() query: PaginationQuery, @Query('sorts', Sieve) sorts) {
        const page = parseInt(query.page || '1');
        const pageSize = parseInt(query.pageSize || '10');

        const blog = await this.blogService.getBlogById(id);

        const [data, count] = await this.blogService.getBlogLikes(blog.id, {
            page,
            pageSize,
            sorts 
        });

        const meta = new PaginationMeta(count, page, pageSize);

        return {
            ...data,
            meta
        }
    }
}