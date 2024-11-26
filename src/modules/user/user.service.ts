import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.dto';
import { User } from './user.entity';
import { PaginateData, PaginatedFindParams, PaginationMeta } from '@/common/dto/pagination.dto';
import { UserRepository } from './user.repository';
import { UserResponse } from './dto/user-response.dto';
import { UpdateUser } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository
  ) { }

  async getUserById(id: User['id']): Promise<UserResponse> {
    const user = await this.userRepository.findUserById(id);
    return new UserResponse(user);
  }

  async createUser(registerBody: CreateUserRequest, profile?: Express.Multer.File ): Promise<UserResponse> {

    const savedUser: User | null = await this.userRepository.findUserByEmailOrNull(registerBody.email);
    
    if(savedUser) {
      throw new ConflictException("User Already registered with email")
    }
    
    const user = await this.userRepository.create({
      password: "",
      email: registerBody.email,
      name: registerBody.name,
      profile: `/profile/${profile?.filename}`,
      bio: registerBody.bio,
      linkedin: registerBody.linkedin,
      github: registerBody.github,
      website: registerBody.github
    });

    this.userRepository.save(user);
    
    return new UserResponse(user);
  }

  async updateUser(id: User['id'], userInfo: UpdateUser): Promise<UserResponse> {

    const user = await this.userRepository.findUserById(id);
  
    user.name = userInfo.name || user.name;
    user.linkedin = userInfo.linkedin || user.linkedin;
  
    await this.userRepository.save(userInfo)

    return new UserResponse(user)
  }

  async getUsers(options: PaginatedFindParams<User>): Promise<PaginateData<UserResponse>> {
    
    const [result, count] = await this.userRepository.findAndCount(options.toFindOption());

    const meta = new PaginationMeta(count, options.page, options.pageSize);
    const userResponseList = result.map(u => new UserResponse(u))
    
    return new PaginateData(userResponseList, meta)
  }

  async deleteUser(id: User['id']): Promise<UserResponse> {

    const user = await this.userRepository.findUserById(id);

    user.deletedAt = new Date();
    user.isActive = false;

    await this.userRepository.save(user);

    return new UserResponse(user)
  }

  async restoreUser(id: User['id']): Promise<UserResponse> {
    const user = await this.userRepository.findUserById(id);
    
    user.deletedAt = undefined;
    user.isActive = true

    await this.userRepository.save(user);
    
    return new UserResponse(user);
  }

  async blockUserById(id: User['id']): Promise<UserResponse> {
    const user = await this.userRepository.findUserById(id);

    user.isBlocked = true;

    await this.userRepository.save(user);

    return new UserResponse(user);
  }

  async unblockUserById(id: User['id']): Promise<UserResponse> {
    const user = await this.userRepository.findUserById(id);

    user.isBlocked = false;

    await this.userRepository.save(user);

    return new UserResponse(user);
  }

}