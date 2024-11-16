import { nanoid } from "nanoid";
import { DataSource } from "typeorm";
import { Blog } from "@/modules/blog/blog.entity";
import { Comment } from "@/modules/comment/comment.entity";
import { Logger } from "@nestjs/common";

const blogs: Array<Partial<Blog>> = [
    {
        title: "Hello world",
        content: "##Hello World",
        description: "Hello world sample",
    }
]

export const entities = [Blog, Comment]

export function seed(AppDataSource: DataSource) {
    const logger = new Logger()
    const blogRepository = AppDataSource.getRepository(Blog);

    blogs.forEach(async (blog: Blog) => {
        const savedBlog = await blogRepository.save({
            ...blog,
            id: nanoid(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        });
        logger.log(`Creating new blog: ${savedBlog.id}`);
    })
}