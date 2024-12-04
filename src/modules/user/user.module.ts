import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserDataSeeder } from './user.seeder';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UserService, UserRepository, UserDataSeeder],
    controllers: [UserController],
    exports: [UserService, UserRepository]
})
export class UserModule implements OnApplicationBootstrap {
    constructor(public readonly seeder: UserDataSeeder) { }

    onApplicationBootstrap() {
        this.seeder.seed();
    }
}