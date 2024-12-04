import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginateData, PaginatedFindParams } from '@/common/dto/pagination.dto';
import { AuthGuard } from '@/common/guards/auth.guard';
import { SieveFilter } from '@/common/pipes/sieve-filter.pipe';
import { User } from './user.entity';
import { UserRole } from './user.enum';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageGenerator } from '@/common/utils/storage.utility';
import { AuthUser } from '@/common/decorator/auth.decorator';
import { ObjectType } from '@/common/types/collection.type';
import { FilterOperators, FindOptionsOrder } from 'typeorm';
import { SieveSort } from '@/common/pipes/sieve-sort.pipe';
import { UserResponse } from './dto/user-response.dto';
import { UpdateUser } from './dto/update-user.dto';
import { CreateUserRequest } from './dto/create-user.dto';
import { UseRoles } from '@/common/decorator/role.decorator';

@ApiTags('User')
@Controller("user")
@UseGuards(AuthGuard)
@ApiBearerAuth('AccessToken')
export class UserController {
  constructor(
    private userService: UserService,
  ) { }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'pageSize', required: false, default: 10, description: 'Maximum number of items in a single page' })
  @ApiQuery({ name: 'filters', required: false, type: String, description: 'Sieve filter to query data' })
  @ApiQuery({ name: 'sorts', required: false, type: Number, description: 'Sieve sort to sort data' })
  async getUsers(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('filters', SieveFilter) filters?: Array<ObjectType<FilterOperators<string>>>, 
    @Query('sorts', SieveSort) sorts?: FindOptionsOrder<User>,
  ): Promise<PaginateData<UserResponse>> {
    
    const findParams = new PaginatedFindParams(parseInt(page,10), parseInt(pageSize,10), filters, sorts)
    return this.userService.getUsers(findParams);
  }

  @Get('self')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('AccessToken')
  async getAuthUser(@AuthUser() user: User): Promise<UserResponse> {
    return new UserResponse(user);
  }

  @Post('create')
  @UseRoles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('profile', { storage: new StorageGenerator('profile').getStorage() }))
  async createUser(@Body() body: CreateUserRequest, @UploadedFile() profile: Express.Multer.File): Promise<UserResponse> {
    return this.userService.createUser(body, profile);
  }

  @Put(':id')
  @UseRoles(UserRole.ADMIN)
  async updateUser(@Body() body: UpdateUser, @Param('id') id: string): Promise<UserResponse> {
    return this.userService.updateUser(id, body)
  }

  @Delete('/:id')
  @UseRoles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.deleteUser(id)
  }

  @Put('/:id/restore')
  @UseRoles(UserRole.ADMIN)
  async restoreUser(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.restoreUser(id)
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.getUserById(id);
  }

  @Put("/block/:id")
  @UseRoles(UserRole.ADMIN)
  async blockUser(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.blockUserById(id);
  }

  @Put("/unblock/:id")
  @UseRoles(UserRole.ADMIN)
  async unblockUser(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.unblockUserById(id);
  }
}
