import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@/modules/user/user.entity';
import { UserRepository } from '@/modules/user/user.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';

describe('UserRepository', () => {
    let service: UserRepository

    const mockUser = new User();
    
    mockUser.id = nanoid();
    mockUser.email = "anonymous@gmail.com";

    const mockRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
        // Add any other methods you plan to use in your service
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRepository,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],
        })
            .compile();
        service = module.get<UserRepository>(UserRepository)
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findUserById', () => {
        it('should return user when matching with id', async () => {
            const userId = mockUser.id;
            jest.spyOn(service, 'findOne').mockResolvedValue(mockUser)

            const result = await service.findUserById(userId);
            expect(result).toEqual(mockUser);
            expect(service.findOne).toHaveBeenCalledWith({"where": {"id": userId}});
        });

        it('should throw when id is missing', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockUser)

            try {
                await service.findUserById("");
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
            }

            expect(service.findOne).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException when user is not found', async () => {
            const userId = mockUser.id;
            jest.spyOn(service, 'findOne').mockResolvedValue(null)
            
            try {
                await service.findUserById(userId);
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
            }
            
            expect(service.findOne).toHaveBeenCalledWith({"where": {"id": userId}});
        })
    });

    describe('findUserByEmail', () => {
        it('should return user when matching with email', async () => {
            const userEmail = mockUser.email;
            jest.spyOn(service, 'findOne').mockResolvedValue(mockUser)

            const result = await service.findUserByEmail(userEmail);
            
            expect(result).toEqual(mockUser);
            expect(service.findOne).toHaveBeenCalledWith({"where": {"email": userEmail}});
            expect(mockUser.email).toMatch(userEmail)
        });

        it('should throw when email is missing', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockUser)

            try {
                await service.findUserByEmail("");
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
            }

            expect(service.findOne).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException when user is not found', async () => {
            const userEmail = mockUser.email;
            jest.spyOn(service, 'findOne').mockResolvedValue(null)
            
            try {
                await service.findUserByEmail(userEmail);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
            }
            
            expect(service.findOne).toHaveBeenCalledWith({"where": {"email": userEmail}});
        })
    });

    describe('findUserByEmailOrNull', () => {
        it('should return user when matching with email', async () => {
            const userEmail = mockUser.email;
            jest.spyOn(service, 'findOne').mockResolvedValue(mockUser)

            const result = await service.findUserByEmailOrNull(userEmail);
            
            expect(result).toEqual(mockUser);
            expect(service.findOne).toHaveBeenCalledWith({"where": {"email": userEmail}});
            expect(mockUser.email).toMatch(userEmail)
        });

        it('should return null when email is missing', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockUser)
            const result = await service.findUserByEmailOrNull("");
            expect(result).toBeNull();
            expect(service.findOne).not.toHaveBeenCalled();
        });

        it('should return null when user is not found', async () => {
            const userEmail = mockUser.email;
            jest.spyOn(service, 'findOne').mockResolvedValue(null)
            const result = await service.findUserByEmailOrNull(userEmail);
            expect(result).toBeNull();
            expect(service.findOne).toHaveBeenCalledWith({"where": {"email": userEmail}});
        })
    });

    // describe('findRandomUser', () => {
    //     it('should get a random user', async () => {

    //         jest.spyOn(service, "count").mockResolvedValue(1)
    //         jest.spyOn(Math, "random").mockReturnValue(1)

    //         const result = await service.findRandomUser();

    //         expect(result).toEqual(mockUserResponse);
    //     });
    // });

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