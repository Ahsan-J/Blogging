import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from '@/modules/blog/blog.service';
import { Blog } from '@/modules/blog/entities/blog.entity';
import { BlogResponse } from '@/modules/blog/dto/blog-response.dto';
import { PaginateData, PaginatedFindParams, PaginationMeta } from '@/common/dto/pagination.dto';
import { BlogRepository } from '@/modules/blog/blog.repository';
import { CreateBlogRequest } from '@/modules/blog/dto/create-blog-request.dto';
import { User } from '@/modules/user/user.entity';
import { BlogListItem } from '@/modules/blog/dto/blog-listing-item.dto';
import { nanoid } from 'nanoid';
import { ForbiddenException } from '@nestjs/common';

describe('BlogService', () => {
    let service: BlogService;
    let blogRepository: BlogRepository;

    let mockBlog: Blog;
    let mockUser: User;
    let mockBlogResponse: BlogResponse;
    let mockBlogListItem: BlogListItem;

    const mockFile = {
        filename: 'test.jpg',
    } as Express.Multer.File;

    const mockBlogRepository: Partial<BlogRepository> = {
        findBlogById: jest.fn(),
        findAllActivePublishedBlogs: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            loadRelationCountAndMap: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis()
        }),
        findBlogLikes: jest.fn(),
        create: jest.fn(),
        findAndCount: jest.fn(),
        save: jest.fn(),
        findUserBlogs: jest.fn(),
    };

    beforeEach(async () => {
        mockUser = new User();
        mockBlog = new Blog();

        mockUser.id = nanoid();

        mockBlog.author = mockUser;
        mockBlog.likes = [mockUser];
        mockBlog.comments = [];

        mockBlogResponse = new BlogResponse(mockBlog);
        mockBlogListItem = new BlogListItem(mockBlog)

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BlogService,
                {
                    provide: BlogRepository,
                    useValue: mockBlogRepository,
                },
            ],
        })
            .compile();

        service = module.get<BlogService>(BlogService);
        blogRepository = module.get<BlogRepository>(BlogRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getBlogs', () => {
        it('should return paginated blogs', async () => {
            const params = new PaginatedFindParams<Blog>(1, 10, [], {})
            const mockBlogList = [mockBlog]

            const meta = new PaginationMeta(1);
            const expectedResponse = new PaginateData([mockBlogListItem], meta)

            jest.spyOn(blogRepository, 'findAllActivePublishedBlogs').mockResolvedValue([mockBlogList, 1])

            const result = await service.getBlogs(params);

            expect(blogRepository.findAllActivePublishedBlogs).toHaveBeenCalledWith(params);

            expect(result).toEqual(expectedResponse);
        });
    });

    describe('createBlog', () => {
        it('should create a blogs', async () => {

            const createBlogDto: CreateBlogRequest = {
                title: 'Jane',
                content: "### Hello World",
                description: "some description",
            };

            jest.spyOn(blogRepository, "create").mockReturnValue(mockBlog)

            const result = await service.createBlog(createBlogDto, mockUser, mockFile);

            expect(blogRepository.create).toHaveBeenCalled();
            expect(blogRepository.save).toHaveBeenCalledWith(mockBlog);

            expect(result).toEqual(new BlogResponse(mockBlog));
        });
    });

    describe('getBlogById', () => {
        it('should get blog by id', async () => {
            const blogId = '1';

            jest.spyOn(blogRepository, 'findBlogById').mockResolvedValue(mockBlog)

            const result = await service.getBlogById(blogId);

            expect(result).toEqual(mockBlogResponse);
        });
    });

    describe('getBlogsByUser', () => {
        it('should update necessary properties of a blog', async () => {

            const params = new PaginatedFindParams<Blog>(1, 10, [], {})
            const mockBlogList = [mockBlog]

            //   const meta = new PaginationMeta(1);
            //   const expectedResponse = new PaginateData([mockBlogResponse], meta)

            jest.spyOn(blogRepository, 'findUserBlogs').mockResolvedValue([mockBlogList, 1]);

            await service.getBlogsByUser(params, mockUser);

            expect(blogRepository.findUserBlogs).toHaveBeenCalledWith(params, mockUser);

            //   expect(result.data).toEqual(expectedResponse.data);
        });
    });

    describe('draftBlog', () => {
        it('should create a draft blog', async () => {

            const createBlogDto: CreateBlogRequest = {
                title: 'Jane',
                content: "### Hello World",
                description: "some description",
            };

            jest.spyOn(blogRepository, 'findBlogById').mockResolvedValue(mockBlog);
            jest.spyOn(blogRepository, 'save').mockResolvedValue(mockBlog);

            const result = await service.draftBlog(createBlogDto, mockUser, mockFile);

            expect(blogRepository.create).toHaveBeenCalled();
            expect(blogRepository.save).toHaveBeenCalledWith(expect.any(Blog));

            expect(result).toEqual(mockBlogResponse);
        });
    });

    describe('deleteBlog', () => {
        it('should return a blog by ID', async () => {
            const blogId = '1';

            jest.spyOn(blogRepository, 'findBlogById').mockResolvedValue(mockBlog);
            jest.spyOn(blogRepository, 'save').mockResolvedValue(mockBlog);

            const result = await service.deleteBlog(blogId, mockUser);

            expect(blogRepository.findBlogById).toHaveBeenCalledWith(blogId);
            expect(blogRepository.save).toHaveBeenCalled();

            expect(result.isActive).toBeFalsy();

        });

        it('should throw when author is different', async () => {
            const blogId = '1';

            mockBlog.author = new User()
            mockBlog.author.id = nanoid();

            jest.spyOn(blogRepository, 'findBlogById').mockResolvedValue(mockBlog);
            jest.spyOn(blogRepository, 'save').mockResolvedValue(mockBlog);

            try {
                await service.deleteBlog(blogId, mockUser);
            } catch (err) {
                expect(err).toBeInstanceOf(ForbiddenException)
            }

            expect(blogRepository.findBlogById).toHaveBeenCalledWith(blogId);
            expect(blogRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('publishBlogById', () => {
        it('should block a blog by ID', async () => {
            const blogId = '1';

            jest.spyOn(blogRepository, 'findBlogById').mockResolvedValue(mockBlog);
            jest.spyOn(blogRepository, 'save').mockResolvedValue(mockBlog);

            const result = await service.publishBlog(blogId, mockUser);

            expect(blogRepository.findBlogById).toHaveBeenCalledWith(blogId);
            expect(blogRepository.save).toHaveBeenCalled();

            expect(result.isPublished).toBeTruthy();
        });

        it('should throw when author is different', async () => {
            const blogId = '1';

            mockBlog.author = new User()
            mockBlog.author.id = nanoid();

            jest.spyOn(blogRepository, 'findBlogById').mockResolvedValue(mockBlog);
            jest.spyOn(blogRepository, 'save').mockResolvedValue(mockBlog);

            try {
                await service.publishBlog(blogId, mockUser);
            } catch (err) {
                expect(err).toBeInstanceOf(ForbiddenException)
            }

            expect(blogRepository.findBlogById).toHaveBeenCalledWith(blogId);
            expect(blogRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('unpublishBlogById', () => {
        it('should block a blog by ID', async () => {
            const blogId = '1';

            jest.spyOn(blogRepository, 'findBlogById').mockResolvedValue(mockBlog);
            jest.spyOn(blogRepository, 'save').mockResolvedValue(mockBlog);

            const result = await service.unpublishBlog(blogId, mockUser);

            expect(blogRepository.findBlogById).toHaveBeenCalledWith(blogId);
            expect(blogRepository.save).toHaveBeenCalled();

            expect(result.isPublished).toBeFalsy();
        });

        it('should throw when author is different', async () => {
            const blogId = '1';

            mockBlog.author = new User()
            mockBlog.author.id = nanoid();

            jest.spyOn(blogRepository, 'findBlogById').mockResolvedValue(mockBlog);
            jest.spyOn(blogRepository, 'save').mockResolvedValue(mockBlog);

            try {
                await service.unpublishBlog(blogId, mockUser);
            } catch (err) {
                expect(err).toBeInstanceOf(ForbiddenException)
            }

            expect(blogRepository.findBlogById).toHaveBeenCalledWith(blogId);
            expect(blogRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('toggleLike', () => {
        it('should remove like if user has already liked the blog', async () => {
            // Prepare a blog with the user already in likes
            const blogWithUserLike = {
                ...mockBlog,
                likes: [mockUser]
            };

            // Mock the query builder chain
            jest.spyOn(blogRepository, 'createQueryBuilder').mockReturnValue({
                where: jest.fn().mockReturnThis(),
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                relation: jest.fn().mockReturnThis(),
                of: jest.fn().mockReturnThis(),
                remove: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(blogWithUserLike)
            } as never);

            // Execute the method
            await service.toggleLike(mockUser, mockBlog);

            // Assertions
            expect(blogRepository.createQueryBuilder).toHaveBeenCalled();
        });

        it('should add like if user has not liked the blog', async () => {
            // Mock the query builder chain to return null (no existing like)
            jest.spyOn(blogRepository, 'createQueryBuilder').mockReturnValue({
                where: jest.fn().mockReturnThis(),
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                relation: jest.fn().mockReturnThis(),
                of: jest.fn().mockReturnThis(),
                add: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(null)
            } as never);

            // Execute the method
            await service.toggleLike(mockUser, mockBlog);

            // Assertions
            expect(blogRepository.createQueryBuilder).toHaveBeenCalled();
        });

        it('should handle edge case of empty likes array', async () => {
            // Mock the query builder chain to return blog with empty likes
            jest.spyOn(blogRepository, 'createQueryBuilder').mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue({
                    ...mockBlog,
                    likes: []
                })
            } as never);

            // Execute the method
            await service.toggleLike(mockUser, mockBlog);

            // Assertions
            expect(blogRepository.createQueryBuilder).toHaveBeenCalled();
        });
    });

    describe('likeBlog', () => {

        const blogId = "1"

        it('should add like if user has not liked the blog', async () => {
            // Mock the query builder chain to return null (no existing like)
            jest.spyOn(blogRepository, 'createQueryBuilder').mockReturnValue({
                where: jest.fn().mockReturnThis(),
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                relation: jest.fn().mockReturnThis(),
                of: jest.fn().mockReturnThis(),
                add: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(null)
            } as never);

            // Execute the method
            await service.likeBlog(blogId, mockUser);

            // Assertions
            expect(blogRepository.createQueryBuilder).toHaveBeenCalled();
        });

        it('should handle edge case of empty likes array', async () => {
            // Mock the query builder chain to return blog with empty likes
            jest.spyOn(blogRepository, 'createQueryBuilder').mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue({
                    ...mockBlog,
                    likes: []
                })
            } as never);

            // Execute the method
            await service.likeBlog(blogId, mockUser);

            // Assertions
            expect(blogRepository.createQueryBuilder).toHaveBeenCalled();
        });
    });

    describe('unlikeBlog', () => {

        const blogId = "1"

        it('should remove like if user has liked the blog', async () => {
            // Mock the query builder chain to return null (no existing like)
            jest.spyOn(blogRepository, 'createQueryBuilder').mockReturnValue({
                where: jest.fn().mockReturnThis(),
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                relation: jest.fn().mockReturnThis(),
                of: jest.fn().mockReturnThis(),
                remove: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(null)
            } as never);

            // Execute the method
            await service.unlikeBlog(blogId, mockUser);

            // Assertions
            expect(blogRepository.createQueryBuilder).toHaveBeenCalled();
        });

        it('should handle edge case of empty likes array', async () => {
            // Mock the query builder chain to return blog with empty likes
            jest.spyOn(blogRepository, 'createQueryBuilder').mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue({
                    ...mockBlog,
                    likes: []
                })
            } as never);

            // Execute the method
            await service.unlikeBlog(blogId, mockUser);

            // Assertions
            expect(blogRepository.createQueryBuilder).toHaveBeenCalled();
        });
    });

    describe('getBlogLikes', () => {
        const mockBlogId = 'blog-123';
        const mockOptions = new PaginatedFindParams<Blog>();

        it('should return paginated blog likes', async () => {
            // Prepare mock data
            const mockBlogs = [
                { id: 'blog-1', title: 'Blog 1' },
                { id: 'blog-2', title: 'Blog 2' }
            ] as Blog[];
            const mockCount = 2;

            // Mock repository method
            jest.spyOn(blogRepository, 'findBlogLikes')
                .mockResolvedValue([mockBlogs, mockCount]);

            // Spy on BlogResponse lazyFetch
            const lazyFetchSpy = jest
                .spyOn(BlogResponse.prototype, 'lazyFetch')
                .mockImplementation(async (blog) => {
                    return {
                        ...blog,
                        processedData: 'processed'
                    } as never;
                });

            // Execute the method
            const result = await service.getBlogLikes(mockBlogId, mockOptions);

            // Assertions
            expect(blogRepository.findBlogLikes).toHaveBeenCalledWith(mockBlogId, mockOptions);
            expect(result).toBeInstanceOf(PaginateData);

            // Check pagination meta
            expect(result.meta).toBeInstanceOf(PaginationMeta);

            // Check transformed blog responses
            expect(result.data.length).toBe(mockBlogs.length);
            expect(lazyFetchSpy).toHaveBeenCalledTimes(mockBlogs.length);

            // Verify each blog was processed
            result.data.forEach((blogResponse, index) => {
                expect(blogResponse).toEqual(expect.objectContaining({
                    ...mockBlogs[index],
                    processedData: 'processed'
                }));
            });
        });

        it('should handle empty results', async () => {
            // Mock repository method with empty result
            jest.spyOn(blogRepository, 'findBlogLikes')
                .mockResolvedValue([[], 0]);

            // Spy on BlogResponse lazyFetch
            const lazyFetchSpy = jest
                .spyOn(BlogResponse.prototype, 'lazyFetch');

            // Execute the method
            const result = await service.getBlogLikes(mockBlogId, mockOptions);

            // Assertions
            expect(blogRepository.findBlogLikes).toHaveBeenCalledWith(mockBlogId, mockOptions);
            expect(result).toBeInstanceOf(PaginateData);
            expect(result.data.length).toBe(0);
            expect(lazyFetchSpy).not.toHaveBeenCalled();
        });
    });

});