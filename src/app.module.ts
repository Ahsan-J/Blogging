import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { CommonModule } from './helper-modules/common/common.module';
import { AppController } from './app.controller';
import { LoggingModule } from './modules/logging/logging.module';
import { UserModule } from './modules/user/user.module';
import { BlogModule } from './modules/blog/blog.module';
import { TokenModule } from './helper-modules/token/token.module';

const databaseConfiguration: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    "type": "postgres",
    "host": configService.get('DATABASE_HOST'),
    "port": parseInt(configService.get('DATABASE_PORT')),
    "username": configService.get('DATABASE_USER'),
    "password": configService.get('DATABASE_PASS'),
    "database": configService.get('DATABASE_NAME'),
    "synchronize": true,
    "autoLoadEntities": true,
  }),
  inject: [ConfigService]
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(databaseConfiguration),
    CommonModule,
    PortfolioModule,
    LoggingModule,
    UserModule,
    TokenModule,
    BlogModule,
  ],
  controllers: [AppController]
})
export class AppModule {}
