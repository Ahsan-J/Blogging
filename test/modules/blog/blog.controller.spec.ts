import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from '@/modules/blog/blog.controller';
import { BlogService } from '@/modules/blog/blog.service';
import { Blog } from '@/modules/blog/entities/blog.entity';
import { PaginateData, PaginatedFindParams, PaginationMeta } from '@/common/dto/pagination.dto';
import { ObjectType } from '@/common/types/collection.type';
import { FilterOperators } from 'typeorm';
import { AuthGuard } from '@/common/guards/auth.guard';
// import { BlogResponse } from '@/modules/blog/dto/blog-response.dto';
import { BlogListItem } from '@/modules/blog/dto/blog-listing-item.dto';
import { User } from '@/modules/user/user.entity';

describe('BlogController', () => {
  let controller: BlogController;
  let service: BlogService;

  const mockUser = new User();
  
  const mockBlog = new Blog();
  mockBlog.author = mockUser;
  mockBlog.author = mockUser;
  mockBlog.likes = [mockUser];
  mockBlog.comments = [];

  // const mockBlogResponse = new BlogResponse(mockBlog);
  const mockBlogListItem = new BlogListItem(mockBlog);

  const mockAuthGuard = {
    canActivate: jest.fn().mockResolvedValue(true),
  };

  const mockBlogService: Partial<BlogService> = {
    createBlog: jest.fn(),
    deleteBlog: jest.fn(),
    draftBlog: jest.fn(),
    getBlogById: jest.fn(),
    getBlogLikes: jest.fn(),
    getBlogs: jest.fn(),
    getBlogsByUser: jest.fn(),
    likeBlog: jest.fn(),
    publishBlog: jest.fn(),
    toggleLike: jest.fn(),
    unlikeBlog: jest.fn(),
    unpublishBlog: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        {
          provide: BlogService,
          useValue: mockBlogService,
        }
      ],
    })
    .overrideGuard(AuthGuard).useValue(mockAuthGuard)
    .compile();

    controller = module.get<BlogController>(BlogController);
    service = module.get<BlogService>(BlogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBlogs', () => {
    it('should return paginated blogs', async () => {
      const page = '1';
      const pageSize = '10';
      const filters: Array<ObjectType<FilterOperators<string>>> = [];
      const sorts: ObjectType = {};

      const meta = new PaginationMeta(1);
      const expectedResponse = new PaginateData([mockBlogListItem], meta)

      jest.spyOn(service, 'getBlogs').mockResolvedValue(expectedResponse);

      const result = await controller.getBlogs(page, pageSize, filters, sorts);

      expect(service.getBlogs).toHaveBeenCalledWith(expect.any(PaginatedFindParams));
      expect(result).toEqual(expectedResponse);
    });
  });
});