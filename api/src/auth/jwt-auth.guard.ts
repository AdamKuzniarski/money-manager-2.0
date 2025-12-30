import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Standard JWT Guard:
 * - nimmt Token aus Authorization: Bearer <token>
 * - Validierung + req.user macht JwtStrategy
 * - keine Dependencies, kein JwtService, kein canActivate nötig
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
