import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

type AuthedRequest = Request & { user?: { userId: number; email: string } };

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  async list(@Req() req: AuthedRequest) {
    const userId = req.user!.userId;
    return this.service.listForUser(userId);
  }

  @Post()
  async create(@Req() req: AuthedRequest, @Body() dto: CreateTransactionDto) {
    const userId = req.user!.userId;
    return this.service.createForUser(userId, dto);
  }

  @Patch(':id')
  async update(
    @Req() req: AuthedRequest,
    @Param('id') idParam: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    const userId = req.user!.userId;
    const id = Number(idParam);
    return this.service.updateForUser(userId, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: AuthedRequest, @Param('id') idParam: string) {
    const userId = req.user!.userId;
    const id = Number(idParam);
    return this.service.deleteForUser(userId, id);
  }
}
