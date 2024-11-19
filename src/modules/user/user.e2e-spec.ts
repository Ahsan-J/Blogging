import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { UserResponse } from './dto/user-response.dto';
import { CreateUserRequest } from './dto/create-user.dto';
import { UpdateUser } from './dto/update-user.dto';

// Mock service methods
const mockUserService = {
  getUsers: jest.fn(),
  getUserById: jest.fn(),
  getAuthUser: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  restoreUser: jest.fn(),
};

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('/GET user (pagination)', async () => {
    const mockUsers = [
      new UserResponse(new User()),
      new UserResponse(new User()),
    ];

    const mockPaginationResponse = {
      data: mockUsers,
      count: 2,
      page: 1,
      limit: 10,
    };

    mockUserService.getUsers.mockResolvedValue(mockPaginationResponse);

    return request(app.getHttpServer())
      .get('/user')
      .query({ page: 1, limit: 10 })
      .expect(200)
      .expect(mockPaginationResponse);
  });

  it('/GET user/self (authenticated user)', async () => {
    const mockUser = new User();
    const mockResponse = new UserResponse(mockUser);

    mockUserService.getAuthUser.mockResolvedValue(mockResponse);

    return request(app.getHttpServer())
      .get('/user/self')
      .set('Authorization', 'Bearer mock-jwt-token')
      .expect(200)
      .expect(mockResponse);
  });

  it('/POST user/create (create user)', async () => {
    const createUserRequest = new CreateUserRequest();
    const mockResponse = new UserResponse(new User());

    mockUserService.createUser.mockResolvedValue(mockResponse);

    return request(app.getHttpServer())
      .post('/user/create')
      .set('Authorization', 'Bearer mock-jwt-token')
      .send(createUserRequest)
      .expect(201)
      .expect(mockResponse);
  });

  it('/PUT user/:id (update user)', async () => {
    const updateUserDto = new UpdateUser();
    const userId = '1';
    const mockResponse = new UserResponse(new User());

    mockUserService.updateUser.mockResolvedValue(mockResponse);

    return request(app.getHttpServer())
      .put(`/user/${userId}`)
      .set('Authorization', 'Bearer mock-jwt-token')
      .send(updateUserDto)
      .expect(200)
      .expect(mockResponse);
  });

  it('/DELETE user/:id (delete user)', async () => {
    const userId = '1';
    const mockResponse = new UserResponse(new User());

    mockUserService.deleteUser.mockResolvedValue(mockResponse);

    return request(app.getHttpServer())
      .delete(`/user/${userId}`)
      .set('Authorization', 'Bearer mock-jwt-token')
      .expect(200)
      .expect(mockResponse);
  });

  it('/PUT user/:id/restore (restore user)', async () => {
    const userId = '1';
    const mockResponse = new UserResponse(new User());

    mockUserService.restoreUser.mockResolvedValue(mockResponse);

    return request(app.getHttpServer())
      .put(`/user/${userId}/restore`)
      .set('Authorization', 'Bearer mock-jwt-token')
      .expect(200)
      .expect(mockResponse);
  });

  it('/GET user/:id (get user by id)', async () => {
    const userId = '1';
    const mockResponse = new UserResponse(new User());

    mockUserService.getUserById.mockResolvedValue(mockResponse);

    return request(app.getHttpServer())
      .get(`/user/${userId}`)
      .expect(200)
      .expect(mockResponse);
  });

  afterAll(async () => {
    await app.close();
  });
});
