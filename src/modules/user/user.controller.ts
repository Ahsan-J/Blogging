import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationMeta, PaginationQuery } from '@/common/dto/pagination.dto';
import { AuthGuard, UseRoles } from '../../common/guards/auth.guard';
import { Sieve } from 'src/common/pipes/sieve.pipe';
import { RegisterUserRequest } from '@/modules/auth/dto/register.dto';
import { ChangeRoleBody, UpdateUser } from './user.dto';
import { User } from './user.entity';
import { UserRole, UserStatus } from './user.enum';
import { UsersService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { getStorage } from 'src/common/utils/utility';
import { AuthUser } from '../auth/auth.decorator';

@ApiTags('User')
@Controller("user")
export class UserController {
  constructor(
    private userService: UsersService,
  ) { }

  @Get()
  async getUsers(@Query() query: PaginationQuery, @Query('filters', Sieve) filters, @Query('sorts', Sieve) sorts): Promise<Array<User> | { meta: PaginationMeta }> {

    const page = parseInt(query.page || '1');
    const pageSize = parseInt(query.pageSize || '10');
    const [data, meta] = await this.userService.getUsers({
      skip: (page - 1) * pageSize,
      take: page * pageSize,
      where: filters,
      order: sorts,
    });

    return {
      ...data,
      meta
    }
  }

  @Get('self')
  @UseGuards(AuthGuard)
  async getAuthUser(@AuthUser() user: User): Promise<User> {
    return this.userService.getUser(user.id);
  }

  @Put('change-role')
  @UseGuards(AuthGuard)
  @UseRoles(UserRole.Admin)
  async changeUserRole(@Body() body: ChangeRoleBody): Promise<User> {
    const user = await this.userService.getUserByEmail(body.email);
    user.isAdmin = true;
    return await this.userService.updateUser(user);
  }

  @Post('create')
  @UseRoles(UserRole.Admin)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profile', { storage: getStorage('profile') }))
  async createUser(@Body() body: RegisterUserRequest, @UploadedFile() profile: Express.Multer.File): Promise<User> {
    const user = await this.userService.createUser(body, profile);
    return user;
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  @UseRoles(UserRole.Admin)
  async updateUser(@Body() body: UpdateUser, @Param('id') id: string): Promise<User> {
    if(!id) throw new BadRequestException(`User "id" is required to edit`)
    
    const user = await this.userService.getUser(id);

    user.name = body.name || user.name;
    user.linkedin = body.linkedin || user.linkedin;
    user.role = body.role || user.role;
    user.status = body.status || user.status;

    return await this.userService.updateUser(user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @UseRoles(UserRole.Admin)
  async deleteUser(@Param('id') id: string, @Query('destroy') destroy: string): Promise<User> {
    
    if(!id) throw new BadRequestException(`User "id" is required to delete`)

    const user = await this.userService.getUser(id);
    if (destroy) {
      await this.userService.destroy(user)
      return user;
    }
    user.deleted_at = new Date().toISOString();
    user.status = UserStatus.Blocked;
    return await this.userService.updateUser(user);
  }

  @Put('/:id/restore')
  @UseGuards(AuthGuard)
  @UseRoles(UserRole.Admin)
  async restoreUser(@Param('id') id: string): Promise<User> {
    if(!id) throw new BadRequestException(`User "id" is required to restore`)
    const user = await this.userService.getUser(id);
    user.deleted_at = null;
    user.isActive = true
    return await this.userService.updateUser(user);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<User> {
    if(!id) throw new BadRequestException(`User "id" is required to access information`)
    return this.userService.getUser(id);
  }
}
