import { IsDateString, IsOptional, IsString } from 'class-validator';

/**
 * Query params für: GET /transactions
 *
 * Beispiele:
 * - /transactions?category=Food
 * - /transactions?from=2026-01-01&to=2026-01-31
 * - /transactions?category=Rent&from=2026-01-01
 */

export class ListTransactionsQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  from?: string; // YYYY-MM-DD

  @IsOptional()
  @IsDateString()
  to?: string; // YYYY-MM-DD
}
