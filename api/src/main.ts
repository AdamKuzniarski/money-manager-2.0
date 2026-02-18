import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

function parseOrigins(value?: string) {
  if (!value) return [];
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  //macht Cookies aus Request lesbar (req.cookies)
  app.use(cookieParser());

  const frontendUrl = configService.get<string>('FRONTEND_URL');
  const configuredOrigins = parseOrigins(
    configService.get<string>('CORS_ORIGINS'),
  );
  const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  const allowedOrigins = Array.from(
    new Set(
      [...defaultOrigins, frontendUrl, ...configuredOrigins].filter(
        (origin): origin is string => Boolean(origin),
      ),
    ),
  );

  // CORS enable (local + production domains via env)
  app.enableCors({
    origin: allowedOrigins,
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
