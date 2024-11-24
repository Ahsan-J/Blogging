import { UserResponse } from "@/modules/user/dto/user-response.dto";
import { Comment } from "../entities/comment.entity";
import { User } from "@/modules/user/user.entity";

export class BlogCommentItem {

    async lazyFetch(comment: Comment): Promise<BlogCommentItem> {
        this.id = comment.id;
        this.commenter = new UserResponse(await comment.commenter);
        this.comment = comment.comment;
        this.createdAt = comment.createdAt;
        this.likes = await this.getLikes(comment.likes);
        this.replies = await this.getReplies(comment.replies);
        this.isActive = comment.isActive
        return this;
    }

    private async getLikes(likes: Array<User>): Promise<Array<UserResponse>> {
        const _likes: Array<UserResponse> = [];
        for (const like of await likes) {
            _likes.push(new UserResponse(await like))
        }
        return _likes;

    }
    private async getReplies(comments: Array<Comment>): Promise<Array<BlogCommentItem>> {
        const _comments: Array<BlogCommentItem> = [];
        for (const comment of await comments) {
            _comments.push(new BlogCommentItem(await comment))
        }
        return _comments;
    }

    constructor(comment?: Comment) {
        if (!comment) return this;
        this.id = comment.id;
        this.commenter = new UserResponse(comment.commenter);
        this.comment = comment.comment
        this.createdAt = comment.createdAt;
        this.likes = comment.likes.map(l => new UserResponse(l));
        this.replies = comment.replies.map(reply => new BlogCommentItem(reply))
        this.isActive = comment.isActive
        return this;
    }

    id: string;
    comment: string;
    createdAt: Date;
    commenter: UserResponse;
    replies: Array<BlogCommentItem>;
    likes: Array<UserResponse>;
    isActive: boolean;
}

