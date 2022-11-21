import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log(process.env.PUBLIC_URL);
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        process.env.BACKEND_URL,
        process.env.DOMAIN,
        process.env.PUBLIC_URL,
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
