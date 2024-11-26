import { UserResponse } from "@/modules/user/dto/user-response.dto";
import { Blog } from "../entities/blog.entity";
import { User } from "@/modules/user/user.entity";
import { BlogCommentItem } from "./blog-comment-item.dto";
import { Comment } from "../entities/comment.entity";

export class BlogResponse {

    async lazyFetch(blog: Blog): Promise<BlogResponse> {
        this.id = blog.id;
        this.description = blog.description;
        this.title = blog.title;
        this.content = blog.content;
        this.author = new UserResponse(await blog.author);
        this.createdAt = blog.createdAt;
        this.likes = await this.getLikes(blog.likes);
        this.comments = await this.getComments(blog.comments);
        this.cover = blog.cover || null;
        this.isActive = blog.isActive;
        this.isPublished = blog.isPublished;
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
        this.likes = blog.likes.map(l => new UserResponse(l));
        this.comments = blog.comments.map(c => new BlogCommentItem(c));
        this.cover = blog.cover || null;
        this.isActive = blog.isActive;
        this.isPublished = blog.isPublished;
        return this;
    }

    id: string;
    description: string;
    title: string;
    content: string;
    createdAt: Date;
    likes: Array<UserResponse>;
    comments: Array<BlogCommentItem>;
    cover: string | null;
    author: UserResponse;
    isActive: boolean;
    isPublished: boolean;

    private async getLikes(likes: Array<User>): Promise<Array<UserResponse>> {
        const _likes: Array<UserResponse> = [];
        for (const like of await likes) {
            _likes.push(new UserResponse(await like))
        }
        return _likes;
    }

    private async getComments(comments: Array<Comment>): Promise<Array<BlogCommentItem>> {
        const _comments: Array<BlogCommentItem> = [];
        for (const comment of await comments) {
            _comments.push(new BlogCommentItem(await comment))
        }
        return _comments;
    }
}

