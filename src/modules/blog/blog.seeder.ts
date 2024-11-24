import { Injectable, Logger } from "@nestjs/common";
import { DataSeeder } from "@/common/interface/seeder.interface";
import { BlogRepository } from "@/modules/blog/blog.repository";
import { nanoid } from "nanoid";
import { Blog } from "@/modules/blog/entities/blog.entity";
import { UserRepository } from "@/modules/user/user.repository";

const blogs: Array<Partial<Blog>> = [
    {
        "id": "kYb66TRUK9TbcRHwI47DF",
        "title": "Hello world",
        "content": "##Hello World",
        "description": "Hello world sample",
    },
    {
        "title": "The Blog",
        "content": `
    
        # This section have all the function that are used all over the application.
        ## Want to Learn
    
        To learn more about Next.js, take a look at the following resources:
    
        - [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
        - [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
        - To document this README.md, You can refer to [this guide](https://www.markdownguide.org/cheat-sheet/) to learn more about markdown.
        - [i18next](https://www.i18next.com) is a simple framework that provide us with a complete solution to localize the application.
        - [Playwright](https://playwright.dev/docs/intro) enables reliable end-to-end testing for modern web apps. We are using Playwright for End to End testing of Module, Pages or a feature flow.
        - [Jest](https://jestjs.io/docs/getting-started) is a delightful JavaScript Testing Framework with a focus on simplicity. No component or page can be complete without using it.
        - [Storybook](https://storybook.js.org/docs/react/get-started/introduction) is a frontend workshop for building UI components and pages in isolation. We are using storybook to document and everything in isolation.`,
        "description": "",
        "id": "123",
        "cover": "https://placehold.co/800x740"
    },
    {
        "title": "The Blog 2",
        "content": '# Some limited information about the blog Some limited information about the blog Some limited information about the blog Some limited information about the blog',
        "description": "",
        "id": "abc",
        "cover": "https://placehold.co/800x540",
    },
    {
        "title": "The Blog 3",
        "content": '# Some limited information about the blog Some limited information about the blog Some limited information about the blog Some limited information about the blog',
        "description": "",
        "id": "xyz",
        "cover": "https://placehold.co/800x240",
    }
]

@Injectable()
export class BlogDataSeeder implements DataSeeder<Blog> {

    private logger = new Logger(BlogDataSeeder.name)

    constructor(
        private blogRepository: BlogRepository,
        private userRepository: UserRepository,
    ) { }

    async seed(dataSet: Partial<Blog>[] = blogs) {
        for (const partialBlog of dataSet) {
            if (!await this.blogRepository.findOne({ where: { id: partialBlog.id } })) {
                this.logger.log(`Adding blog ${partialBlog.id}`)
                await this.blogRepository.save(await this.createBlog(partialBlog))
            }
        }
    }

    private async createBlog(data: Partial<Blog>): Promise<Blog> {
        const blog = this.blogRepository.create()

        blog.id = data.id || nanoid();
        blog.title = data.title || ""
        blog.content = data.content || "";
        blog.description = data.description || "";
        blog.cover = data.cover;
        blog.isActive = true;
        blog.isPublished = true;

        const randomAuthor = await this.userRepository.findRandomUser();
        if (randomAuthor) blog.author = randomAuthor;

        return blog;
    }
}