import { Injectable, Logger } from "@nestjs/common";
import { DataSeeder } from "@/common/interface/seeder.interface";
import { BlogRepository } from "@/modules/blog/blog.repository";
import { nanoid } from "nanoid";
import { Blog } from "@/modules/blog/blog.entity";
import { UserRepository } from "@/modules/user/user.repository";

const blogs: Array<Partial<Blog>> = [
    {
        "id": "kYb66TRUK9TbcRHwI47DF",
        "title": "Hello world",
        "content": "##Hello World",
        "description": "Hello world sample"
    }
]

@Injectable()
export class BlogDataSeeder implements DataSeeder<Blog> {

    private logger = new Logger(BlogDataSeeder.name)

    constructor(
        private blogRepository: BlogRepository,
        private userRepository: UserRepository,
    ) {}

    async seed(dataSet: Partial<Blog>[] = blogs) {
        for(const partialBlog of dataSet) {
            if(!await this.blogRepository.findOne({ where: { id: partialBlog.id } })) {
                this.logger.log(`Adding blog ${partialBlog.id}`)
                await this.blogRepository.save(await this.createBlog(partialBlog))
            }
        }
    }

    private async createBlog(data: Partial<Blog>): Promise<Blog> {
        const blog = new Blog();

        blog.id = data.id || nanoid();
        blog.title = data.title || ""
        blog.content = data.content || "";
        blog.description = data.description || "";
        blog.isActive = true;
        blog.isPublished = true;
        
        const randomAuthor = await this.userRepository.findRandomUser();
        if(randomAuthor) blog.author = randomAuthor;
        
        return blog;
    }
}