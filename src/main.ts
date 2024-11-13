import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/response.interceptor';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useStaticAssets(join(process.cwd(), 'public'));
  
  const configService = app.get(ConfigService);
  
  if (configService.get("NODE_ENV") === 'production') {
    app.use(helmet());
  }

  // app.use(csurf());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => new BadRequestException({
      error: "Field validation failed",
      validation: errors.reduce((result, error) => {
        result[error.property] = Object.values(error.constraints).pop();
        return result
      }, {}),
      statusCode: 400,
    }),
  }));

  const config = new DocumentBuilder()
    .setTitle('Blogging API')
    .setDescription('Blogging API doc ')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'AccessToken')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(configService.get("PORT") || 3000);
}
bootstrap();
