import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';
import { SummaryQueryDto } from './dto/summary-query.dto';

type AuthedRequest = Request & { user?: { userId: number; email: string } };

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactions: TransactionsService) {}

  @Get()
  async list(
    @Req() req: AuthedRequest,
    @Query() query: ListTransactionsQueryDto,
  ) {
    const userId = req.user?.userId as number;
    return this.transactions.listForUser(userId, query);
  }

  @Get('summary')
  summary(@Req() req: AuthedRequest, @Query() query: SummaryQueryDto) {
    const userId = req.user?.userId as number;
    return this.transactions.monthlySummary(userId, query.month);
  }
  @Post()
  async create(@Req() req: AuthedRequest, @Body() dto: CreateTransactionDto) {
    const userId = req.user?.userId as number;
    return this.transactions.createForUser(userId, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthedRequest,
    @Param('id') idParam: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    const userId = req.user?.userId as number;
    const id = Number(idParam); // id Number(idParam) --> später mit Pipes tauschen
    return this.transactions.updateForUser(userId, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: AuthedRequest, @Param('id') idParam: string) {
    const userId = req.user?.userId as number;
    const id = Number(idParam); // id Number(idParam) --> später mit Pipes tauschen
    return this.transactions.deleteForUser(userId, id);
  }
}
