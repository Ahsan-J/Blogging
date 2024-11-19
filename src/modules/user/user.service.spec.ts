import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { User } from './user.entity';
// import { UserRole } from './user.enum';
import { CreateUserRequest } from './dto/create-user.dto';
// import { UpdateUser } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { PaginateData, PaginatedFindParams, PaginationMeta } from '@/common/dto/pagination.dto';
import { UserRepository } from './user.repository';
import { UserRole } from './user.enum';
import { ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let service: UsersService;
  let userRepository: UserRepository;

  const mockUser = new User();
  const mockUserResponse = new UserResponse(mockUser);

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
            provide: UserRepository,
            useValue: mockUserRepository,
        },
      ],
    })
    .compile();

    service = module.get<UsersService>(UsersService);
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

//   describe('updateUser', () => {
//     it('should update an existing user', async () => {
//       const userId = '1';
//       const updateUserDto: UpdateUser = {
//         name: 'Updated',
//         linkedin: "https://api.linkedin.com",
//         role: UserRole.ADMIN,
//         status: 1
//       };

//       jest.spyOn(service,'updateUser').mockResolvedValue(mockUserResponse);

//       const result = await controller.updateUser(updateUserDto, userId);

//       expect(service.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
//       expect(result).toEqual(mockUserResponse);
//     });
//   });

//   describe('deleteUser', () => {
//     it('should delete a user', async () => {
//       const userId = '1';

//       jest.spyOn(service, 'deleteUser').mockResolvedValue(mockUserResponse);

//       const result = await controller.deleteUser(userId);

//       expect(service.deleteUser).toHaveBeenCalledWith(userId);
//       expect(result).toEqual(mockUserResponse);
//     });
//   });

//   describe('restoreUser', () => {
//     it('should restore a deleted user', async () => {
//       const userId = '1';

//       jest.spyOn(service, 'restoreUser').mockResolvedValue(mockUserResponse);

//       const result = await controller.restoreUser(userId);

//       expect(service.restoreUser).toHaveBeenCalledWith(userId);
//       expect(result).toEqual(mockUserResponse);
//     });
//   });

//   describe('getUser', () => {
//     it('should return a user by ID', async () => {
//       const userId = '1';

//       jest.spyOn(service, 'getUserById').mockResolvedValue(mockUserResponse);

//       const result = await controller.getUser(userId);

//       expect(service.getUserById).toHaveBeenCalledWith(userId);
//       expect(result).toEqual(mockUserResponse);
//     });
//   });
});