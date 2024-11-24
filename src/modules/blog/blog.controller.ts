import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PaginateData, PaginatedFindParams } from "@/common/dto/pagination.dto";
import { SieveFilter } from "@/common/pipes/sieve-filter.pipe";
import { StorageGenerator } from "@/common/utils/storage.utility";
import { AuthUser } from "@/common/decorator/auth.decorator";
import { AuthGuard } from "@/common/guards/auth.guard";
import { User } from "@/modules/user/user.entity";
import { CreateBlog } from "./dto/create-blog.dto";
import { Blog } from "./entities/blog.entity";
import { BlogService } from "./blog.service";
import { SieveSort } from "@/common/pipes/sieve-sort.pipe";
import { ObjectType } from "@/common/types/collection.type";
import { FilterOperators, FindOptionsOrder } from "typeorm";
import { BlogResponse } from "./dto/blog-response.dto";
import { BlogListItem } from "./dto/blog-listing-item.dto";

@ApiTags('Blog')
@Controller('blog')
export class BlogController {

    constructor(
        private readonly blogService: BlogService
    ) { }

    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number, default: 1, description: 'Page number for pagination' })
    @ApiQuery({ name: 'pageSize', required: false, default: 10, description: 'Maximum number of items in a single page' })
    @ApiQuery({ name: 'filters', required: false, type: String, description: 'Sieve filter to query data' })
    @ApiQuery({ name: 'sorts', required: false, type: Number, description: 'Sieve sort to sort data' })
    async getBlogs(
        @Query('page') page: string = "1",
        @Query('pageSize') pageSize: string = "10",
        @Query('filters', SieveFilter) filters?: Array<ObjectType<FilterOperators<string>>>,
        @Query('sorts', SieveSort) sorts?: FindOptionsOrder<Blog>
    ): Promise<PaginateData<BlogListItem>> {
        const findParams = new PaginatedFindParams(parseInt(page, 10), parseInt(pageSize, 10), filters, sorts)
        return this.blogService.getBlogs(findParams);
    }

    @Get("my-blogs")
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @ApiQuery({ name: 'page', required: false, type: Number, default: 1, description: 'Page number for pagination' })
    @ApiQuery({ name: 'pageSize', required: false, default: 10, description: 'Maximum number of items in a single page' })
    @ApiQuery({ name: 'filters', required: false, type: String, description: 'Sieve filter to query data' })
    @ApiQuery({ name: 'sorts', required: false, type: Number, description: 'Sieve sort to sort data' })
    async getMyBlogs(
        @AuthUser() user: User,
        @Query('page') page: string = "1",
        @Query('pageSize') pageSize: string = "10",
        @Query('filters', SieveFilter) filters?: Array<ObjectType<FilterOperators<string>>>,
        @Query('sorts', SieveSort) sorts?: FindOptionsOrder<Blog>,
    ): Promise<PaginateData<BlogListItem>> {
        const findParams = new PaginatedFindParams(parseInt(page, 10), parseInt(pageSize, 10), filters, sorts)
        return this.blogService.getBlogsByUser(findParams, user);
    }

    @Post('create')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('cover', { storage: new StorageGenerator('blog_banners').getStorage() }))
    async createBlog(
        @Body() body: CreateBlog,
        @AuthUser() user: User,
        @UploadedFile() cover: Express.Multer.File
    ): Promise<BlogResponse> {
        return this.blogService.createBlog(body, user, cover);
    }

    @Get(':id')
    @ApiParam({ name: 'id', required: true, type: String, description: 'Blog id to fetch' })
    async getBlogPost(@Param("id") id: string): Promise<BlogResponse> {
        return this.blogService.getBlogById(id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @ApiParam({ name: 'id', required: true, type: String, description: 'Blog id to delete' })
    async deleteBlog(@Param("id") id: string, @AuthUser() user: User) {
        this.blogService.deleteBlog(id, user);
    }

    @Post(':id/like')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @ApiParam({ name: 'id', required: true, type: String, description: 'Blog id to like' })
    async likeBlog(@Param("id") id: string, @AuthUser() user: User) {
        return this.blogService.likeBlog(id, user);
    }

    @Post(':id/unlike')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @ApiParam({ name: 'id', required: true, type: String, description: 'Blog id to unlike' })
    async unlikeBlog(@Param("id") id: string, @AuthUser() user: User) {
        return this.blogService.unlikeBlog(id, user);
    }

    @Get(":id/likes")
    @ApiParam({ name: 'id', required: true, type: String, description: 'Blog id to fetch' })
    @ApiQuery({ name: 'page', required: false, type: Number, default: 1, description: 'Page number for pagination' })
    @ApiQuery({ name: 'pageSize', required: false, type: Number, default: 10, description: 'Maximum number of items in a single page' })
    @ApiQuery({ name: 'sorts', required: false, type: Number, description: 'Sieve sort to sort data' })
    async getPostLikes(
        @Param("id") id: string,
        @Query('page') page: string = "1",
        @Query('pageSize') pageSize: string = "10",
        @Query('sorts', SieveSort) sorts?: FindOptionsOrder<Blog>,
    ) {
        const findParams = new PaginatedFindParams(parseInt(page, 10), parseInt(pageSize, 10), [], sorts)
        return this.blogService.getBlogLikes(id, findParams);
    }
}