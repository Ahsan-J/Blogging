import { Repository } from "typeorm";
import { Blog } from "./entities/blog.entity";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class BlogRepository extends Repository<Blog> {
    constructor(
        @InjectRepository(Blog)
        repository: Repository<Blog>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
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