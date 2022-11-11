import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        'http://10.18.196.254',
        'http://10.18.196.254:8080',
        'http://10.18.196.254:3000',
        'http://localhost',
        'http://localhost:8080',
        'http://localhost:3000',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE'],
      credentials: true,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
