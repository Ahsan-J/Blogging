import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserDataSeeder } from './user.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersService, UserRepository, UserDataSeeder],
  controllers: [UserController],
  exports: [UsersService, UserRepository]
})
export class UserModule implements OnApplicationBootstrap {
  constructor(public readonly seeder: UserDataSeeder){}

  onApplicationBootstrap() {
    this.seeder.seed();
  }
}