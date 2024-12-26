import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { ObjectType } from '@/common/types/collection.type';
import { AppModule } from './app.module';
import { join } from 'path';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { IdempotencyInterceptor } from './common/interceptors/idempotency.interceptor';
import { LRUCacheManager } from './common/utils/lru-cache.utility';
import express from 'express';
import { RunInClusterMode } from './cluster';

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server));

  app.enableCors();
  app.useStaticAssets(join(process.cwd(), 'public'));
  
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  
  const configService = app.get(ConfigService);
  
  if (configService.get("NODE_ENV") === 'production') {
    app.use(helmet());
  }

  const LRUCache = new LRUCacheManager(10);
  const reflect = app.get(Reflector)

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflect));
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalInterceptors(new IdempotencyInterceptor(LRUCache, reflect));
  app.useGlobalInterceptors(new AppResponseInterceptor());

  app.useGlobalPipes(validationPipe);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', 
  })

  const config = new DocumentBuilder()
    .setTitle('Blogging API')
    .setDescription('Blogging API doc ')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'AccessToken')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();

  server.listen(configService.get("PORT", 3000));

  return server;
}

const validationPipe = new ValidationPipe({
  exceptionFactory: (errors) => new BadRequestException({
    error: "Field validation failed",
    validation: errors.reduce<ObjectType>((result, error) => {
      if(error.constraints) {
        result[error.property] = Object.values<string>(error.constraints).pop();
      }
      return result
    }, {}),
    statusCode: 400,
  }),
})

export default RunInClusterMode(bootstrap);
// export default bootstrap();