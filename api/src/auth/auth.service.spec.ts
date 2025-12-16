import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      create: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should hash password and create user', async () => {
    const dto = { email: 'test@example.com', password: 'supersecret' };

    const fakeCreated = {
      id: 1,
      email: dto.email,
      createdAt: new Date(),
    };

    prisma.user.create.mockResolvedValue(fakeCreated);

    const result = await service.register(dto);

    expect(result).toEqual(fakeCreated);

    // Inspect the call args
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    const createArgs = prisma.user.create.mock.calls[0][0];

    expect(createArgs.data.email).toBe(dto.email);
    expect(createArgs.data.passwordHash).toEqual(expect.any(String));
    expect(createArgs.data.passwordHash).not.toBe(dto.password);
  });

  it('should throw ConflictException when email already exists', async () => {
    const dto = { email: 'dup@example.com', password: 'supersecret' };

    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      { code: 'P2002', clientVersion: '5.0.0' },
    );

    prisma.user.create.mockRejectedValueOnce(prismaError);

    await expect(service.register(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('should rethrow other errors', async () => {
    const dto = { email: 'err@example.com', password: 'supersecret' };

    const genericError = new Error('DB is on fire');
    prisma.user.create.mockRejectedValueOnce(genericError);

    await expect(service.register(dto)).rejects.toBe(genericError);
  });
});
