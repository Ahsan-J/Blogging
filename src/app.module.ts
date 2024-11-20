import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from '@/modules/contact/contact.module';
import { AppController } from './app.controller';
import { UserModule } from '@/modules/user/user.module';
import { BlogModule } from '@/modules/blog/blog.module';
import { TokenModule } from '@/shared/token/token.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { PageBuilderModule } from './modules/page-builder/page-builder.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
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
