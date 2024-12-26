import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from '@/modules/contact/contact.module';
import { AppController } from './app.controller';
import { UserModule } from '@/modules/user/user.module';
import { BlogModule } from '@/modules/blog/blog.module';
import { TokenModule } from '@/shared/token/token.module';
import { DatabaseConfiguration } from './common/config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { PageBuilderModule } from './modules/page-builder/page-builder.module';
import { MailModule } from './shared/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MailModule.forRoot(),
    TypeOrmModule.forRootAsync(DatabaseConfiguration),
    ContactModule,
    AuthModule,
    UserModule,
    PageBuilderModule,
    BlogModule,
    TokenModule,
  ],
  controllers: [AppController]
})
export class AppModule {}
