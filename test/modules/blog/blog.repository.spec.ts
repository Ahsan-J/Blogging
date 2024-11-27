import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogRepository } from '@/modules/blog/blog.repository';
import { Blog } from '@/modules/blog/entities/blog.entity';
import { User } from '@/modules/user/user.entity';
import { PaginatedFindParams } from '@/common/dto/pagination.dto';
import { InvalidInstanceofException } from '@/common/exceptions/instanceof.exception';
import { BadRequestException } from '@nestjs/common';

describe('BlogRepository', () => {
  let blogRepository: BlogRepository;
  let mockRepository: Partial<Repository<Blog>>;

  beforeEach(async () => {

    mockRepository = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogRepository,
        {
          provide: getRepositoryToken(Blog),
          useValue: mockRepository
        }
      ]
    }).compile();

    blogRepository = module.get<BlogRepository>(BlogRepository);
  });

  describe('findAllActivePublishedBlogs', () => {
    it('should throw InvalidInstanceofException if options is not PaginatedFindParams', async () => {
      await expect(
        blogRepository.findAllActivePublishedBlogs({} as PaginatedFindParams<Blog>)
      ).rejects.toThrow(InvalidInstanceofException);
    });

    it('should return active and published blogs with pagination', async () => {
      // Prepare mock data
      const mockOptions = new PaginatedFindParams<Blog>(1, 10, [{"id" : "1"}]);
    
      const mockBlogs = [{ id: '1' }, { id: '2' }] as Blog[];
      const mockCount = 2;

      // Mock query builder
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockBlogs, mockCount])
      } as never;

      // Spy on createQueryBuilder
      jest.spyOn(blogRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      // Execute method
      const [blogs, count] = await blogRepository.findAllActivePublishedBlogs(mockOptions);

      expect(blogs).toEqual(mockBlogs);
      expect(count).toBe(mockCount);
    });
  });

  describe('findUserBlogs', () => {
    it('should throw InvalidInstanceofException if options is not PaginatedFindParams', async () => {
      const mockUser = { id: 'user-1' } as User;
      await expect(
        blogRepository.findUserBlogs({} as PaginatedFindParams<Blog>, mockUser)
      ).rejects.toThrow(InvalidInstanceofException);
    });

    it('should return user blogs with pagination', async () => {
      // Prepare mock data
      const mockOptions = new PaginatedFindParams<Blog>();
      const mockUser = { id: 'user-1' } as User;
      const mockBlogs = [{ id: '1' }, { id: '2' }] as Blog[];
      const mockCount = 2;

      // Mock toFindOption
      const mockFindOptions = {
        where: {}
      };
      jest.spyOn(mockOptions, 'toFindOption').mockReturnValue(mockFindOptions);

      // Mock findAndCount
      jest.spyOn(blogRepository, 'findAndCount').mockResolvedValue([mockBlogs, mockCount]);

      // Execute method
      const [blogs, count] = await blogRepository.findUserBlogs(mockOptions, mockUser);

      // Assertions
      expect(mockOptions.toFindOption).toHaveBeenCalled();
      expect(mockFindOptions.where).toEqual(expect.objectContaining({
        author: { id: mockUser.id }
      }));
      expect(blogs).toEqual(mockBlogs);
      expect(count).toBe(mockCount);
    });
  });

  describe('findBlogLikes', () => {
    it('should throw InvalidInstanceofException if options is not PaginatedFindParams', async () => {
      await expect(
        blogRepository.findBlogLikes('blog-1', {} as PaginatedFindParams<Blog>)
      ).rejects.toThrow(InvalidInstanceofException);
    });

    it('should return blog likes', async () => {
      // Prepare mock data
      const mockBlogId = 'blog-1';
      const mockOptions = new PaginatedFindParams<Blog>();
      const mockBlog = new Blog()
      const mockBlogs = [mockBlog]
      const mockCount = 1;

      // Mock query builder
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockBlogs, mockCount])
      } as never;

      // Spy on createQueryBuilder
      jest.spyOn(blogRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      // Execute method
      const [blogs, count] = await blogRepository.findBlogLikes(mockBlogId, mockOptions);

      // Assertions
      expect(blogs).toEqual(mockBlogs);
      expect(count).toBe(mockCount);
    });
  });

  describe('findBlogById', () => {
    it('should throw BadRequestException if id is not provided', async () => {
      await expect(
        blogRepository.findBlogById('')
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if blog is not found', async () => {
      // Mock findOne to return null
      jest.spyOn(blogRepository, 'findOne').mockResolvedValue(null);

      await expect(
        blogRepository.findBlogById('non-existent-id')
      ).rejects.toThrow(BadRequestException);
    });

    it('should return blog when found', async () => {
      // Prepare mock blog
      const mockBlog = { id: 'blog-1', title: 'Test Blog' } as Blog;

      // Mock findOne
      jest.spyOn(blogRepository, 'findOne').mockResolvedValue(mockBlog);

      // Execute method
      const blog = await blogRepository.findBlogById('blog-1');

      // Assertions
      expect(blog).toEqual(mockBlog);
      expect(blogRepository.findOne).toHaveBeenCalledWith({ where: { id: 'blog-1' } });
    });
  });
});