import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from '@/modules/blog/blog.service';
import { Blog } from '@/modules/blog/entities/blog.entity';
import { BlogResponse } from '@/modules/blog/dto/blog-response.dto';
import { PaginateData, PaginatedFindParams } from '@/common/dto/pagination.dto';
import { CreateBlogRequest } from '@/modules/blog/dto/create-blog-request.dto';
import { User } from '@/modules/user/user.entity';
import { BlogListItem } from '@/modules/blog/dto/blog-listing-item.dto';
import { BlogController } from '@/modules/blog/blog.controller';
import { FindOptionsOrder } from 'typeorm';
import { nanoid } from 'nanoid';
import { AuthGuard } from '@/common/guards/auth.guard';

describe('BlogController', () => {
  let service: BlogService;
  let controller: BlogController;

  let mockBlog: Blog;
  let mockUser: User;
  let mockBlogResponse: BlogResponse;
  let mockBlogListItem: BlogListItem;

  const mockAuthGuard = {
    canActivate: jest.fn().mockResolvedValue(true),
  };

  const mockFile = {
    filename: 'test.jpg',
  } as Express.Multer.File;

  const mockService: Partial<BlogService> = {
    getBlogs: jest.fn(),
    getBlogById: jest.fn(),
    createBlog: jest.fn(),
    deleteBlog: jest.fn(),
    draftBlog: jest.fn(),
    getBlogLikes: jest.fn(),
    getBlogsByUser: jest.fn(),
    likeBlog: jest.fn(),
    publishBlog: jest.fn(),
    toggleLike: jest.fn(),
    unlikeBlog: jest.fn(),
    unpublishBlog: jest.fn(),
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
      controllers: [BlogController],
      providers: [
        {
          provide: BlogService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard).useValue(mockAuthGuard)
      .compile();

    service = module.get<BlogService>(BlogService);
    controller = module.get<BlogController>(BlogController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBlogs', () => {
    it('should return paginated blogs', async () => {
      // Prepare mock data
      const mockPaginateData: PaginateData<BlogListItem> = {
        data: [mockBlogListItem],
        meta: {
          total: 0,
          page_size: 0,
          current_page: 0,
          last_page: 0,
          from: 0,
          to: 0
        }
      };

      // Mock service method
      jest.spyOn(service, 'getBlogs').mockResolvedValue(mockPaginateData);

      // Execute method
      const result = await controller.getBlogs();

      // Assertions
      expect(service.getBlogs).toHaveBeenCalledWith(expect.any(PaginatedFindParams));
      expect(result).toBe(mockPaginateData);
    });

    it('should handle custom pagination and filtering', async () => {
      // Prepare mock data
      const mockPaginateData: PaginateData<BlogListItem> = {
        data: [mockBlogListItem],
        meta: {
          total: 0,
          page_size: 0,
          current_page: 0,
          last_page: 0,
          from: 0,
          to: 0
        }
      };

      const mockSorts: FindOptionsOrder<Blog> = { createdAt: 'DESC' };

      jest.spyOn(service, 'getBlogs').mockResolvedValue(mockPaginateData);

      const result = await controller.getBlogs("2", "15", [], mockSorts);

      expect(service.getBlogs).toHaveBeenCalledWith(expect.any(PaginatedFindParams));
      expect(result).toBe(mockPaginateData);
    });
  });

  describe('getMyBlogs', () => {
    it('should return user-specific blogs', async () => {
      // Prepare mock data
      const mockPaginateData: PaginateData<BlogListItem> = {
        data: [mockBlogListItem],
        meta: {
          total: 0,
          page_size: 0,
          current_page: 0,
          last_page: 0,
          from: 0,
          to: 0
        }
      };

      jest.spyOn(service, 'getBlogsByUser').mockResolvedValue(mockPaginateData);

      const result = await controller.getMyBlogs(mockUser);

      expect(service.getBlogsByUser).toHaveBeenCalledWith(
        expect.any(PaginatedFindParams),
        mockUser
      );
      expect(result).toBe(mockPaginateData);
    });
  });

  describe('createBlog', () => {
    it('should create a blog', async () => {
      // Prepare mock data
      const mockCreateRequest = {} as CreateBlogRequest;

      // Mock service method
      jest.spyOn(service, 'createBlog').mockResolvedValue(mockBlogResponse);

      // Execute method
      const result = await controller.createBlog(
        mockCreateRequest,
        mockUser,
        mockFile
      );

      // Assertions
      expect(service.createBlog).toHaveBeenCalledWith(
        mockCreateRequest,
        mockUser,
        mockFile
      );
      expect(result).toBe(mockBlogResponse);
    });
  });

  describe('Blog Interactions', () => {
    const mockBlogId = 'blog-1';

    it('should get a specific blog by id', async () => {
      const mockBlog = new Blog()
      mockBlog.author = mockUser
      const mock = new BlogResponse(mockBlog)
      
      jest.spyOn(service, 'getBlogById').mockResolvedValue(mock);

      const result = await controller.getBlogPost(mockBlogId);

      expect(service.getBlogById).toHaveBeenCalledWith(mockBlogId);
      expect(result).toBe(mock);
    });

    it('should delete a blog', async () => {
      await controller.deleteBlog(mockBlogId, mockUser);

      expect(service.deleteBlog).toHaveBeenCalledWith(
        mockBlogId,
        mockUser
      );
    });

    it('should like a blog', async () => {
      await controller.likeBlog(mockBlogId, mockUser);

      expect(service.likeBlog).toHaveBeenCalledWith(
        mockBlogId,
        mockUser
      );
    });

    it('should unlike a blog', async () => {
      await controller.unlikeBlog(mockBlogId, mockUser);

      expect(service.unlikeBlog).toHaveBeenCalledWith(
        mockBlogId,
        mockUser
      );
    });

    it('should get blog likes', async () => {
      const mockPaginateData: PaginateData<BlogResponse> = {
        data: [],
        meta: {
          total: 0,
          page_size: 0,
          current_page: 0,
          last_page: 0,
          from: 0,
          to: 0
        }
      };
      jest.spyOn(service, 'getBlogLikes').mockResolvedValue(mockPaginateData);

      const result = await controller.getPostLikes(mockBlogId);

      expect(service.getBlogLikes).toHaveBeenCalledWith(
        mockBlogId,
        expect.any(PaginatedFindParams)
      );
      expect(result).toBe(mockPaginateData);
    });

    it('should publish a blog', async () => {
      await controller.publishBlog(mockBlogId, mockUser);

      expect(service.publishBlog).toHaveBeenCalledWith(
        mockBlogId,
        mockUser
      );
    });

    it('should unpublish a blog', async () => {
      await controller.unpublishBlog(mockBlogId, mockUser);

      expect(service.unpublishBlog).toHaveBeenCalledWith(
        mockBlogId,
        mockUser
      );
    });
  });
});