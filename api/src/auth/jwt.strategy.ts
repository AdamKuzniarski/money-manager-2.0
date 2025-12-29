import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

/**
 * Wir holen das JWT aus einem httpOnly Cookie.
 * WICHTIG: cookie-parser muss in main.ts aktiv sein, sonst gibt's req.cookies nicht.
 */
function cookieExtractor(cookieName: string) {
  return (req: Request): string | null => {
    // cookie-parser hängt "cookies" an das Request-Objekt.

    const cookies = (req as Request & { cookies?: Record<string, string> })
      .cookies;

    if (!cookies) return null;

    const token = cookies[cookieName];

    // Nur echte Strings zurückgeben, sonst null
    return typeof token === 'string' && token.length > 0 ? token : null;
  };
}

type JwtPayload = {
  sub: number; // userId (klassische JWT-Convention)
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const cookieName = config.get<string>('AUTH_COOKIE_NAME') ?? 'mm_token';

    // getOrThrow => TS weiß: kommt NICHT undefined zurück (sonst throw)
    const jwtSecret = config.getOrThrow<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor(cookieName),

        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
