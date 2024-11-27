import { Repository } from "typeorm";
import { Blog } from "./entities/blog.entity";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginatedFindParams } from "@/common/dto/pagination.dto";
import { InvalidInstanceofException } from "@/common/exceptions/instanceof.exception";
import { BlogStatus } from "./blog.enum";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";
import { User } from "@/modules/user/user.entity";

@Injectable()
export class BlogRepository extends Repository<Blog> {

    bitwiseOperator = new BitwiseOperator<BlogStatus>();

    constructor(
        @InjectRepository(Blog)
        repository: Repository<Blog>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async findAllActivePublishedBlogs(options: PaginatedFindParams<Blog>): Promise<[Blog[], number]> {
        // validation check to make sure only instances are allowed
        
        if (!(options instanceof PaginatedFindParams)) throw new InvalidInstanceofException("PaginatedFindParams")

        const blogPublished = this.bitwiseOperator.setValue(0, BlogStatus.PUBLISH)
        const blogActive = this.bitwiseOperator.setValue(0, BlogStatus.ACTIVE)

        const queryBuilder = this.createQueryBuilder('blog').where(`status & ${blogActive} = ${blogActive}`).andWhere(`status & ${blogPublished} = ${blogPublished}`);
        
        const filters = options.toQueryWhere();
        if(filters) queryBuilder.andWhere(filters)

        const orderBy = options.toQueryOrder();
        if(orderBy) queryBuilder.orderBy(orderBy)

        return queryBuilder.getManyAndCount()
    }

    async findUserBlogs(options: PaginatedFindParams<Blog>, user: User) {
        // validation check to make sure only instances are allowed
        if (!(options instanceof PaginatedFindParams)) throw new InvalidInstanceofException("PaginatedFindParams")
        
        const findOptions = options.toFindOption();
        findOptions.where = { ...findOptions.where, author: { id: user.id }}

        return this.findAndCount(findOptions);
    }

    async findBlogLikes(blogId: Blog['id'], options: PaginatedFindParams<Blog>) {

        if (!(options instanceof PaginatedFindParams)) throw new InvalidInstanceofException("PaginatedFindParams")

        return this.createQueryBuilder("blog")
            .leftJoinAndSelect("blog.likes", "user")
            .where("blog.id = :id", { id: blogId })
            .getManyAndCount()
    }

    async findBlogById(id: string): Promise<Blog> {
        if (!id) {
            throw new BadRequestException(`"id" is needed to fetch define. got ${id}`)
        }

        const blog = await this.findOne({ where: { id } });

        if (!blog) {
            throw new BadRequestException(`No User found for the id ${id}`)
        }

        return blog;
    }
}