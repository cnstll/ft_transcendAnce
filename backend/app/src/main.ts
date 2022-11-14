import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';

// const httpsOptions = {
//   key: fs.readFileSync('/home/certs/transcendance.key'),
//   cert: fs.readFileSync('/home/certs/transcendance.crt'),
// };

async function bootstrap() {
  console.log(process.env.FRONTEND_URL);
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
    logger: ['debug', 'verbose', 'log', 'warn', 'error'],
    // httpsOptions,
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
