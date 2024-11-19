import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { UserRole } from './user.enum';
import { CreateUserRequest } from './dto/create-user.dto';
import { UpdateUser } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { PaginatedFindParams } from '@/common/dto/pagination.dto';
import { ObjectType } from '@/common/types/collection.type';
import { FilterOperators } from 'typeorm';
import { TokenService } from '@/shared/token/token.service';
import { Reflector } from '@nestjs/core';
import { UserRepository } from './user.repository';

describe('UserController', () => {
  let controller: UserController;
  let service: UsersService;

  const mockUser = new User();

  mockUser.id = '1';
  mockUser.email = 'test@example.com';
  mockUser.name = 'John';
  mockUser.role = 0;
  mockUser.password = ""; 
  mockUser.profile = "profile info"; 
  mockUser.linkedin = "https://linkedin/in/ahsan-j"; 
  mockUser.github = "https://github.com/Ahsan-J";
  mockUser.createdAt = new Date();
  mockUser.updatedAt = new Date();
  mockUser.bio = "biography"; 
  mockUser.website = "https://ahsan-j.github.io/"; 
  mockUser.blogs = []; 
  mockUser.like_blogs = [];
  mockUser.following = []; 
  mockUser.followers = []; 
  mockUser.isActive = true; 
  mockUser.isBlocked = false;
  mockUser.isAdmin = false; 
  

  const mockUserResponse = new UserResponse(mockUser);

  const mockUsersService = {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    restoreUser: jest.fn(),
  };

  const mockTokenService = {
    generateToken: jest.fn(),
    validateAccessToken: jest.fn(),
    getTokenData: jest.fn(),
  };

  const mockUserRepository = {
    findUserById: jest.fn(),
    findRandomUser: jest.fn(),
    findUserByEmail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const page = '1';
      const pageSize = '10';
      const filters: Array<ObjectType<FilterOperators<string>>> = [];
      const sorts: ObjectType = {};
      const expectedResponse = {
        data: [mockUserResponse],
        total: 1,
        page: 1,
        pageSize: 10,
      };

      mockUsersService.getUsers.mockResolvedValue(expectedResponse);

      const result = await controller.getUsers(page, pageSize, filters, sorts);

      expect(service.getUsers).toHaveBeenCalledWith(
        expect.any(PaginatedFindParams)
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getAuthUser', () => {
    it('should return the authenticated user', async () => {
      const result = await controller.getAuthUser(mockUser);

      expect(result).toBeInstanceOf(UserResponse);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserRequest = {
        email: 'new@example.com',
        name: 'Jane',
        bio: "new bio",
        role: UserRole.ADMIN,
        github: "https://github.com/example",
        linkedin: "https://linkedin.com/",
        website: "https://example.com/"
      };

      const mockFile = {
        filename: 'test.jpg',
      } as Express.Multer.File;

      mockUsersService.createUser.mockResolvedValue(mockUserResponse);

      const result = await controller.createUser(createUserDto, mockFile);

      expect(service.createUser).toHaveBeenCalledWith(createUserDto, mockFile);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUser = {
        name: 'Updated',
        linkedin: "https://api.linkedin.com",
        role: UserRole.ADMIN,
        status: 1
      };

      mockUsersService.updateUser.mockResolvedValue(mockUserResponse);

      const result = await controller.updateUser(updateUserDto, userId);

      expect(service.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = '1';

      mockUsersService.deleteUser.mockResolvedValue(mockUserResponse);

      const result = await controller.deleteUser(userId);

      expect(service.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('restoreUser', () => {
    it('should restore a deleted user', async () => {
      const userId = '1';

      mockUsersService.restoreUser.mockResolvedValue(mockUserResponse);

      const result = await controller.restoreUser(userId);

      expect(service.restoreUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const userId = '1';

      mockUsersService.getUserById.mockResolvedValue(mockUserResponse);

      const result = await controller.getUser(userId);

      expect(service.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserResponse);
    });
  });
});