import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsString()
  @MinLength(1)
  category!: string;

  // nur positive Zahlen, Prisma mach davon Dezimal
  @IsPositive()
  amount!: number;

  //ISO String: entweder 2025-12-15 o. 2025-12-15T10:00:00Z
  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  note?: string;
}
