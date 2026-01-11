import { Matches } from 'class-validator';

/**
 * Query params für GET /transactions/summary
 *
 * Beispiel:
 *  /transactions/summary?month=2026-01
 */

export class SummaryQueryDto {
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'month must be in format YYYY-MM (e.g. 2026-01)',
  })
  month!: string;
}
