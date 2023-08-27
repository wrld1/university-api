import { NestFactory } from '@nestjs/core';
import { AppModule } from './application/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerOptions = new DocumentBuilder()
    .setTitle('University API')
    .setDescription('This page provides University API documentation')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`/docs`, app, swaggerDocument);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
