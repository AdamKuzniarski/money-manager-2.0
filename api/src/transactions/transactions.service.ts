import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

type ListFilters = {
  category?: string;
  from?: string;
  to?: string;
};

function startOfDay(dateStr: string): Date {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function endOfDay(dateStr: string): Date {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

function monthlyRange(month: string): { from: Date; toExclusive: Date } {
  const [y, m] = month.split('-').map((v) => Number(v));
  const year = y;
  const monthIndex = m - 1;

  const from = new Date(Date.UTC(year, monthIndex, 1));
  const toExclusive = new Date(Date.UTC(year, monthIndex + 1, 1));

  return { from, toExclusive };
}

function normalizeDate(dateStr: string): Date {
  const d = new Date(`${dateStr}T00:00:00.000Z`);

  if (Number.isNaN(d.getTime())) {
    throw new BadRequestException('Invalid date');
  }

  return d;
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(
    userId: number,
    filters?: ListFilters,
  ): Promise<Transaction[]> {
    const where: Prisma.TransactionWhereInput = { userId };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.from && filters?.to) {
      const from = startOfDay(filters.from);
      const to = endOfDay(filters.to);

      if (from.getTime() > to.getTime()) {
        throw new BadRequestException('from must be earlier than to');
      }

      where.date = { gte: from, lte: to };
    } else if (filters?.from) {
      where.date = { gte: startOfDay(filters.from) };
    } else if (filters?.to) {
      where.date = { lte: endOfDay(filters.to) };
    }

    return this.prisma.transaction.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createForUser(
    userId: number,
    dto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        ...dto,
        date: normalizeDate(dto.date),
        userId,
      },
    });
  }

  async updateForUser(
    userId: number,
    id: number,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    const data: Prisma.TransactionUpdateInput = {
      ...dto,
    };

    if (dto.date) {
      data.date = normalizeDate(dto.date);
    }

    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async deleteForUser(userId: number, id: number): Promise<{ ok: true }> {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    await this.prisma.transaction.delete({ where: { id } });
    return { ok: true };
  }

  async monthlySummary(userId: number, month: string) {
    const { from, toExclusive } = monthlyRange(month);

    const [incomeAgg, expenseAgg] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { userId, type: 'INCOME', date: { gte: from, lt: toExclusive } },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          userId,
          type: 'EXPENSE',
          date: { gte: from, lt: toExclusive },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = incomeAgg._sum.amount ?? new Prisma.Decimal(0);
    const totalExpenses = expenseAgg._sum.amount ?? new Prisma.Decimal(0);
    const balance = totalIncome.minus(totalExpenses);

    return {
      month,
      totalIncome: totalIncome.toString(),
      totalExpenses: totalExpenses.toString(),
      balance: balance.toString(),
    };
  }
}
