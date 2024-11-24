import { UserResponse } from "@/modules/user/dto/user-response.dto";
import { Blog } from "../entities/blog.entity";

export class BlogListItem {

    async lazyFetch(blog: Blog): Promise<BlogListItem> {
        this.id = blog.id;
        this.description = blog.description;
        this.title = blog.title;
        this.content = blog.content;
        this.author = new UserResponse(await blog.author);
        this.createdAt = blog.createdAt;
        this.likes = (await blog.likes || []).length;
        this.comments = (await blog.comments || []).length;
        this.cover = blog.cover || null;

        return this;
    }

    constructor(blog?: Blog) {
        if (!blog) return this;
        this.id = blog.id;
        this.description = blog.description;
        this.title = blog.title;
        this.content = blog.content;
        this.author = new UserResponse(blog.author);
        this.createdAt = blog.createdAt;
        this.likes = blog.likes.length;
        this.comments = blog.comments.length;
        this.cover = blog.cover || null;
        return this;
    }

    id: string
    description: string
    title: string
    content: string
    createdAt: Date
    likes: number
    comments: number
    cover: string | null
    author: UserResponse
}
