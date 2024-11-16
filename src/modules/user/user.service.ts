import { ConflictException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequest } from './dto/create-user.dto';
import { User } from './user.entity';
import { PaginateData, PaginatedFindParams, PaginationMeta } from '@/common/dto/pagination.dto';
import { UserRepository } from './user.repository';
import { UserResponse } from './dto/user-response.dto';
import { UpdateUser } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    // @InjectRepository(User)
    private userRepository: UserRepository
  ) { }

  async getUserById(id: User['id']): Promise<UserResponse> {
    const user = await this.userRepository.findUserById(id);
    return new UserResponse(user);
  }

  async createUser(registerBody: CreateUserRequest, profile?: Express.Multer.File ): Promise<UserResponse> {

    const savedUser: User = await this.userRepository.findUserByEmail(registerBody.email);
    
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
    user.role = userInfo.role || user.role;
  
    const updatedUser = await this.userRepository.save(userInfo)

    return new UserResponse(updatedUser)
  }

  async getUserByEmail(email: User['email']): Promise<UserResponse> {
    const user = await this.userRepository.findUserByEmail(email);
    return new UserResponse(user);
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

    const updatedUser = await this.userRepository.save(user);

    return new UserResponse(updatedUser)
  }

  async restoreUser(id: User['id']): Promise<UserResponse> {
    const user = await this.userRepository.findUserById(id);
    
    user.deletedAt = null;
    user.isActive = true

    const updatedUser = await this.userRepository.save(user);
    
    return new UserResponse(updatedUser);
  }

}