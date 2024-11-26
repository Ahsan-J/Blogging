import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from '@/modules/blog/blog.service';
import { Blog } from '@/modules/blog/entities/blog.entity';
import { BlogResponse } from '@/modules/blog/dto/blog-response.dto';
import { PaginateData, PaginatedFindParams, PaginationMeta } from '@/common/dto/pagination.dto';
import { BlogRepository } from '@/modules/blog/blog.repository';
import { CreateBlogRequest } from '@/modules/blog/dto/create-blog-request.dto';
import { User } from '@/modules/user/user.entity';
import { SelectQueryBuilder } from 'typeorm';
import { BlogListItem } from '@/modules/blog/dto/blog-listing-item.dto';

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
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    mockUser = new User();
    mockBlog = new Blog();

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
    
      const queryBuilderMock: Partial<SelectQueryBuilder<Blog>> = {
        where: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        loadRelationCountAndMap: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockBlog), // Simulate the blog data being returned
      };

      jest.spyOn(blogRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as SelectQueryBuilder<Blog>)

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

      jest.spyOn(blogRepository, 'findAndCount').mockResolvedValue([mockBlogList, 1]);

      await service.getBlogsByUser(params, mockUser);

      expect(blogRepository.findAndCount).toHaveBeenCalled();

    //   expect(result.data).toEqual(expectedResponse.data);
    });
  });

  describe('draftBlog', () => {
    it('should restore a deleted blog', async () => {

    const createBlogDto: CreateBlogRequest = {
        title: 'Jane',
        content: "### Hello World",
        description: "some description",
    };

      jest.spyOn(blogRepository, 'findBlogById').mockResolvedValue(mockBlog);
      jest.spyOn(blogRepository, 'save').mockResolvedValue(mockBlog);

      const result = await service.draftBlog(createBlogDto, mockUser, mockFile);

      expect(blogRepository.create).toHaveBeenCalled();
      expect(blogRepository.save).toHaveBeenCalledWith(mockBlog);

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
  });

});