import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;

  const prismaMock = {
    $queryRaw: jest.fn(),
    user: { count: jest.fn() },
    transaction: { count: jest.fn() },
  } as unknown as PrismaService;

  beforeEach(async () => {
    prismaMock.$queryRaw = jest.fn().mockResolvedValue(undefined);
    prismaMock.user.count = jest.fn().mockResolvedValue(1);
    prismaMock.transaction.count = jest.fn().mockResolvedValue(2);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return basic health status', () => {
    expect(controller.checkHealth()).toEqual({ status: 'ok' });
  });

  it('should return db health status with counts', async () => {
    const result = await controller.getDbHealth();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.$queryRaw).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.user.count).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.transaction.count).toHaveBeenCalled();

    expect(result).toEqual({
      status: 'db ok',
      usersCount: 1,
      transactionsCount: 2,
    });
  });
});
