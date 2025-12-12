import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}
  @Get()
  checkHealth() {
    return { status: 'ok' };
  }

  @Get('db')
  async getDbHealth() {
    //Connectivity check
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'db ok' };
  }
}
