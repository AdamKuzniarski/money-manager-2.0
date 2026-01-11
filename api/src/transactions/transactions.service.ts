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
  //query kommt meistens als "YYYY-MM-DD" -> new Date wird zu Mitternacht

  const d = new Date(dateStr);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function endOfDay(dateStr: string): Date {
  const d = new Date(dateStr);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

function monthlyRange(month: string): { from: Date; toExclusive: Date } {
  // month = "YYYY-MM"
  const [y, m] = month.split('-').map((v) => Number(v));
  const year = y;
  const monthIndex = m - 1; //0..11

  const from = new Date(Date.UTC(year, monthIndex, 1));
  const toExclusive = new Date(Date.UTC(year, monthIndex + 1, 1));

  return { from, toExclusive };
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(
    userId: number,
    filters?: ListFilters,
  ): Promise<Transaction[]> {
    const where: Prisma.TransactionWhereInput = { userId };

    //category filter
    if (filters?.category) {
      where.category = filters.category;
    }

    // Date range filters
    if (filters?.from && filters?.to) {
      const from = startOfDay(filters.from);
      const to = endOfDay(filters.to);

      if (from.getTime() > to.getTime()) {
        throw new BadRequestException('from must be larger than to');
      }

      where.date = { gte: from, lte: to };
    } else if (filters?.from) {
      where.date = { gte: startOfDay(filters.from) };
    } else if (filters.to) {
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
        userId,
      },
    });
  }

  async updateForUser(
    userId: number,
    id: number,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    //Ownership check - nur go wenn id UND userId stimmen
    const updated = await this.prisma.transaction.updateMany({
      where: { id, userId },
      data: {
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.amount !== undefined
          ? { amount: new Prisma.Decimal(dto.amount) }
          : {}),
        ...(dto.date !== undefined ? { date: new Date(dto.date) } : {}),
        ...(dto.note !== undefined ? { note: dto.note } : {}),
      },
    });

    if (updated.count === 0) {
      //entweder Transaction existiert o. gehört andere Person
      throw new NotFoundException('Transaction not found');
    }

    // Transaction nach dem Update zurückgeben
    const tx = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!tx) throw new NotFoundException('Transaction not found');

    return tx;
  }

  async deleteForUser(userId: number, id: number): Promise<{ ok: true }> {
    const deleted = await this.prisma.transaction.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('Transaction not found');
    }

    return { ok: true };
  }
}
