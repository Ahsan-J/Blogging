import { nanoid } from "nanoid";
import { DataSource } from "typeorm";
import { Blog } from "../../modules/blog/blog.entity";
import { Comment } from "../../modules/comment/comment.entity";

const blogs: Array<Partial<Blog>> = [
    {
        title: "Hello world",
        content: "##Hello World",
        description: "Hello world sample",
    }
]

export const entities = [Blog, Comment]

export function seed(AppDataSource: DataSource) {
    
    const blogRepository = AppDataSource.getRepository(Blog);

    blogs.forEach(async (blog: Blog) => {
        const savedBlog = await blogRepository.save({
            id: nanoid(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
            ...blog
        });
        console.log(`Creating new blog: ${savedBlog.id}`);
    })
}