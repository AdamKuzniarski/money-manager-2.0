import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: number): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async createForUser(
    userId: number,
    dto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        userId,
        type: dto.type,
        category: dto.category,
        amount: new Prisma.Decimal(dto.amount), //macht die Spalte dezimal
        date: new Date(dto.date),
        note: dto.note ?? null,
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
