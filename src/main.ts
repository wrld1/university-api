import { NestFactory } from '@nestjs/core';
import { AppModule } from './application/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as express from 'express';
import path from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use(
    '/uploads',
    express.static(path.join(__dirname, '../../', 'uploads')),
  );

  const pathTest = path.join(__dirname, '../../', 'uploads');
  console.log(pathTest);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('University API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Authorization',
      },
      'jwt',
    )
    .setDescription('This page provides University API documentation')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`/docs`, app, swaggerDocument);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
