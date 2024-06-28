import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableCircularCheck: true,
      },
    }),
  );
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'https://taste-eat-next-42fwfw3gf-daniil2204s-projects.vercel.app/',
      'https://taste-eat-next.vercel.app/',
    ],
  });
  await app.listen(4000);
}
bootstrap();
