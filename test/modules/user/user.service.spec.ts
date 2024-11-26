import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/user.entity';
import { CreateUserRequest } from '@/modules/user/dto/create-user.dto';
import { UserResponse } from '@/modules/user/dto/user-response.dto';
import { PaginateData, PaginatedFindParams, PaginationMeta } from '@/common/dto/pagination.dto';
import { UserRepository } from '@/modules/user/user.repository';
import { UserRole } from '@/modules/user/user.enum';
import { ConflictException } from '@nestjs/common';
import { UpdateUser } from '@/modules/user/dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;

  let mockUser: User;
  let mockUserResponse: UserResponse;

  const mockUserRepository = {
    findUserById: jest.fn(),
    findRandomUser: jest.fn(),
    findUserByEmail: jest.fn(),
    findUserByEmailOrNull: jest.fn(),
    create: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    mockUser = new User()
    mockUserResponse = new UserResponse(mockUser);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
            provide: UserRepository,
            useValue: mockUserRepository,
        },
      ],
    })
    .compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const params = new PaginatedFindParams<User>(1, 10, [], {})
      const mockUserList = [mockUser]

      const meta = new PaginationMeta(1);
      const expectedResponse = new PaginateData([mockUserResponse], meta)

      jest.spyOn(userRepository, 'findAndCount').mockResolvedValue([mockUserList, 1])

      const result = await service.getUsers(params);

      expect(userRepository.findAndCount).toHaveBeenCalledWith(params.toFindOption());

      expect(result).toEqual(expectedResponse);
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

      jest.spyOn(userRepository, "findUserByEmailOrNull").mockResolvedValue(null)
      jest.spyOn(userRepository, "create").mockReturnValue(mockUser)

      const result = await service.createUser(createUserDto, mockFile);

      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(userRepository.findUserByEmailOrNull).toHaveBeenCalledWith(createUserDto.email);

      expect(result).toEqual(mockUserResponse);
    });

    it('should throw when a user exists', async () => {
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
  
        jest.spyOn(userRepository, "findUserByEmailOrNull").mockResolvedValue(mockUser)
        
        try {
            await service.createUser(createUserDto, mockFile)
        } catch(e) {
            expect(e).toBeInstanceOf(ConflictException)
        }

        expect(userRepository.findUserByEmailOrNull).toHaveBeenCalledWith(createUserDto.email);
  
      });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      const userId = '1';

      jest.spyOn(userRepository,'findUserById').mockResolvedValue(mockUser);

      const result = await service.getUserById(userId);

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('updateUser', () => {
    it('should update necessary properties of a user', async () => {
      const userId = '1';

      const updatedUser: UpdateUser = {
        name: "jane doe",
        linkedin: "https://linkedin.com/in/jane",
        status: 1,
      }

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.updateUser(userId, updatedUser);

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.save).toHaveBeenCalled();

      expect(result.name).toEqual(updatedUser.name);
      expect(result.linkedin).toEqual(updatedUser.linkedin);
    });

    it('should not change on missing user property', async () => {
      const userId = '1';

      mockUser.name = "john doe";
      mockUser.linkedin = "https://www.google.com"

      const updatedUser: UpdateUser = {
        name: "",
        linkedin: "",
        status: 1,
      }

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.updateUser(userId, updatedUser);

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.save).toHaveBeenCalled();

      expect(result.name).toEqual(mockUser.name);
      expect(result.linkedin).toEqual(mockUser.linkedin);
    });

  });

  describe('restoreUser', () => {
    it('should restore a deleted user', async () => {
      const userId = '1';

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.restoreUser(userId);

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.save).toHaveBeenCalled();

      expect(result.isActive).toBeTruthy();
    });
  });

  describe('deleteUser', () => {
    it('should return a user by ID', async () => {
      const userId = '1';

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.deleteUser(userId);

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.save).toHaveBeenCalled();

      expect(result.isActive).toBeFalsy();
    });
  });

  describe('blockUserById', () => {
    it('should block a user by ID', async () => {
      const userId = '1';

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.blockUserById(userId);

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.save).toHaveBeenCalled();

      expect(result.isBlocked).toBeTruthy();
    });
  });

  describe('unblockUserById', () => {
    it('should block a user by ID', async () => {
      const userId = '1';

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.unblockUserById(userId);

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.save).toHaveBeenCalled();

      expect(result.isBlocked).toBeFalsy();
    });
  });

});