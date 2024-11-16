import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginateData, PaginatedFindParams, PaginationQuery } from '@/common/dto/pagination.dto';
import { AuthGuard, UseRoles } from '@/common/guards/auth.guard';
import { SieveFilter } from '@/common/pipes/sieve-filter.pipe';
import { User } from './user.entity';
import { UserRole } from './user.enum';
import { UsersService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { getStorage } from '@/common/utils/storage.utility';
import { AuthUser } from '@/common/decorator/auth.decorator';
import { ObjectType } from '@/common/types/collection.type';
import { FilterOperators, FindOptionsOrder } from 'typeorm';
import { SieveSort } from '@/common/pipes/sieve-sort.pipe';
import { UserResponse } from './dto/user-response.dto';
import { UpdateUser } from './dto/update-user.dto';
import { CreateUserRequest } from './dto/create-user.dto';

@ApiTags('User')
@Controller("user")
export class UserController {
  constructor(
    private userService: UsersService,
  ) { }

  @Get()
  async getUsers(
    @Query() query?: PaginationQuery, 
    @Query('filters', SieveFilter) filters?: Array<ObjectType<FilterOperators<string>>>, 
    @Query('sorts', SieveSort) sorts?: FindOptionsOrder<User>,
  ): Promise<PaginateData<UserResponse>> {
    
    const findParams = new PaginatedFindParams(query, filters, sorts)
    return this.userService.getUsers(findParams);
  }

  @Get('self')
  @UseGuards(AuthGuard)
  async getAuthUser(@AuthUser() user: User): Promise<UserResponse> {
    return this.userService.getUserById(user.id);
  }

  @Post('create')
  @UseRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profile', { storage: getStorage('profile') }))
  async createUser(@Body() body: CreateUserRequest, @UploadedFile() profile: Express.Multer.File): Promise<UserResponse> {
    return this.userService.createUser(body, profile);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  @UseRoles(UserRole.ADMIN)
  async updateUser(@Body() body: UpdateUser, @Param('id') id: string): Promise<UserResponse> {
    return this.userService.updateUser(id, body)
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @UseRoles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.deleteUser(id)
  }

  @Put('/:id/restore')
  @UseGuards(AuthGuard)
  @UseRoles(UserRole.ADMIN)
  async restoreUser(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.restoreUser(id)
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.getUserById(id);
  }
}
