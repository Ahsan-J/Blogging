import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/modules/user/user.controller';
import { UsersService } from '@/modules/user/user.service';
import { User } from '@/modules/user/user.entity';
import { UserRole } from '@/modules/user/user.enum';
import { CreateUserRequest } from '@/modules/user/dto/create-user.dto';
import { UpdateUser } from '@/modules/user/dto/update-user.dto';
import { UserResponse } from '@/modules/user/dto/user-response.dto';
import { PaginateData, PaginatedFindParams, PaginationMeta } from '@/common/dto/pagination.dto';
import { ObjectType } from '@/common/types/collection.type';
import { FilterOperators } from 'typeorm';
import { AuthGuard } from '@/common/guards/auth.guard';

describe('UserController', () => {
  let controller: UserController;
  let service: UsersService;

  const mockUser = new User();
  const mockUserResponse = new UserResponse(mockUser);

  const mockAuthGuard = {
    canActivate: jest.fn().mockResolvedValue(true),
  };

  const mockUsersService = {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    restoreUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        }
      ],
    })
    .overrideGuard(AuthGuard).useValue(mockAuthGuard)
    .compile();

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

      const meta = new PaginationMeta(1);
      const expectedResponse = new PaginateData([mockUserResponse], meta)

      jest.spyOn(service, 'getUsers').mockResolvedValue(expectedResponse);

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

      jest.spyOn(service,'createUser').mockResolvedValue(mockUserResponse);

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
        status: 1
      };

      jest.spyOn(service,'updateUser').mockResolvedValue(mockUserResponse);

      const result = await controller.updateUser(updateUserDto, userId);

      expect(service.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = '1';

      jest.spyOn(service, 'deleteUser').mockResolvedValue(mockUserResponse);

      const result = await controller.deleteUser(userId);

      expect(service.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('restoreUser', () => {
    it('should restore a deleted user', async () => {
      const userId = '1';

      jest.spyOn(service, 'restoreUser').mockResolvedValue(mockUserResponse);

      const result = await controller.restoreUser(userId);

      expect(service.restoreUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const userId = '1';

      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUserResponse);

      const result = await controller.getUser(userId);

      expect(service.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserResponse);
    });
  });
});