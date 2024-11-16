import { UserResponse } from "@/modules/user/dto/user-response.dto";
import { Blog } from "../blog.entity";

export class BlogResponse {

    constructor(blog: Blog){
        this.id = blog.id;
        this.description = blog.description;
        this.title = blog.title;
        this.content = blog.content;
        this.author = new UserResponse(blog.author); 
        this.createdAt = blog.createdAt; 
        this.likes = blog.likes.length;
        this.comments = blog.comments.length; 
    }
    
    id: string 
    description: string 
    title: string 
    content: string
    createdAt: Date 
    likes: number 
    comments: number
    author: UserResponse 
}

