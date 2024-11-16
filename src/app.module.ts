import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from '@/modules/contact/contact.module';
import { AppController } from './app.controller';
import { LoggingModule } from '@/modules/logging/logging.module';
import { UserModule } from '@/modules/user/user.module';
import { BlogModule } from '@/modules/blog/blog.module';
import { TokenModule } from '@/shared/token/token.module';
import { DatabaseConfiguration } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(DatabaseConfiguration),
    ContactModule,
    LoggingModule,
    UserModule,
    BlogModule,
    TokenModule,
  ],
  controllers: [AppController]
})
export class AppModule {}
