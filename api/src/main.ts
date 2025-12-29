import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  //macht Cookies aus Request lesbar (req.cookies)
  app.use(cookieParser());

  // CORS enable
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('API_PORT') ?? 4000;

  await app.listen(port);
}
bootstrap().catch((error) => {
  console.error('Error during NestJS bootstrap', error);
  process.exit(1);
});
