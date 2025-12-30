import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userID: number): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userID },
      orderBy: { date: 'desc' },
    });
  }

  async createForUser(
    userID: number,
    dto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        userID,
        type: dto.type,
        category: dto.category,
        amount: new Prisma.Decimal(dto.amount), //macht die Spalte dezimal
        date: new Date(dto.date),
        note: dto.note ?? null,
      },
    });
  }

  async updateForUser(
    userID: number,
    id: number,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    //Ownership check - nur go wenn id UND userID stimmen
    const updated = await this.prisma.transaction.updateMany({
      where: { id, userID },
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
      where: { id, userID },
    });

    if (!tx) throw new NotFoundException('Transaction not found');

    return tx;
  }

  async deleteForUser(userID: number, id: number): Promise<{ ok: true }> {
    const deleted = await this.prisma.transaction.deleteMany({
      where: { id, userID },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('Transaction not found');
    }

    return { ok: true };
  }
}
