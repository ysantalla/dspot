import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Env } from './env';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from './exceptions/mongodb-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('User')
    .setDescription('This sample project is user CRUD.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  const port = configService.get<number>(Env.Port) || 3000;

  app.useGlobalFilters(
    new MongoExceptionFilter()
  );

  await app.listen(port);
  console.log(`Application running at ${port} port`);
}
bootstrap();
