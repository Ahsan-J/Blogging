import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { PaginateData, PaginatedFindParams } from "@/common/dto/pagination.dto";
import { SieveFilter } from "@/common/pipes/sieve-filter.pipe";
import { getStorage } from "@/common/utils/storage.utility";
import { AuthUser } from "@/common/decorator/auth.decorator";
import { AuthGuard } from "@/common/guards/auth.guard";
import { User } from "@/modules/user/user.entity";
import { CreateBlog } from "./dto/create-blog.dto";
import { Blog } from "./blog.entity";
import { BlogService } from "./blog.service";
import { SieveSort } from "@/common/pipes/sieve-sort.pipe";
import { ObjectType } from "@/common/types/collection.type";
import { FilterOperators, FindOptionsOrder } from "typeorm";
import { BlogResponse } from "./dto/blog-response.dto";

@ApiTags('Blog')
@Controller('blog')
export class BlogController {

    constructor(
        private readonly blogService: BlogService
    ) { }

    @Get()
    async getBlogs(
        @Query('page') page: string,
        @Query('pageSize') pageSize: string, 
        @Query('filters', SieveFilter) filters: Array<ObjectType<FilterOperators<string>>>, 
        @Query('sorts', SieveSort) sorts: FindOptionsOrder<Blog>
    ): Promise<PaginateData<BlogResponse>> {
        const findParams = new PaginatedFindParams(parseInt(page,10), parseInt(pageSize,10), filters, sorts)
        return this.blogService.getBlogs(findParams);
    }

    @Post('create')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('banner', { storage: getStorage('blog_banners') }))
    async createBlog(
        @Body() body: CreateBlog, 
        @AuthUser() user: User, 
        @UploadedFile() banner: Express.Multer.File
    ): Promise<BlogResponse> {
        return this.blogService.createBlog(body, user, banner);
    }

    @Get(':id')
    async getBlogPost(@Param("id") id: string): Promise<BlogResponse> {
        return this.blogService.getBlogById(id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    async deleteBlog(@Param("id") id: string, @AuthUser() user: User) {
        this.blogService.deleteBlog(id, user);
    }

    @Post(':id/like')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    async likeBlog(@Param("id") id: string, @AuthUser() user: User) {
        return this.blogService.likeBlog(id, user);
    }

    @Post(':id/unlike')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    async unlikeBlog(@Param("id") id: string, @AuthUser() user: User) {
        return this.blogService.unlikeBlog(id, user);
    }

    @Get(":id/likes")
    async getPostLikes(
        @Param("id") id: string, 
        @Query('page') page: string,
        @Query('pageSize') pageSize: string,
        @Query('sorts', SieveSort) sorts: FindOptionsOrder<Blog>,
    ) {
        const findParams = new PaginatedFindParams(parseInt(page,10), parseInt(pageSize,10), [], sorts)
        const blog = await this.blogService.getBlogById(id);
        return this.blogService.getBlogLikes(blog.id, findParams);
    }
}