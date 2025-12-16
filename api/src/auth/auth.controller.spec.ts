import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { register: jest.Mock };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should delegate to AuthService.register and return result', async () => {
    const dto: RegisterDto = {
      email: 'test@example.com',
      password: 'supersecret',
    };

    const fakeUser = {
      id: 1,
      email: dto.email,
      createdAt: new Date(),
    };

    authService.register.mockResolvedValue(fakeUser);

    const result = await controller.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual(fakeUser);
  });
});
