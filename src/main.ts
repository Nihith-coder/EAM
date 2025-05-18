/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const basePath = process.env.BASE_PATH || 'eam';
  app.setGlobalPrefix(
    basePath.replace(/^\//, '')
  );

  const config = new DocumentBuilder()
    .setTitle(
      'Environment Application Management',
    )
    .setDescription(
      'Purpose of this application is to control the environment',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );
  SwaggerModule.setup(`${basePath}/swagger/index.html`, app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // important for default values to kick in
    whitelist: true,
  }));


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
