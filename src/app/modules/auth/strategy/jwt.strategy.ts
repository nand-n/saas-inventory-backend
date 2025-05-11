// jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { COOKIE_NAMES } from '../constants/strategies.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest:ExtractJwt.fromExtractors([
          (req) =>req?.cookies?.[COOKIE_NAMES.JWT] || null
      ]),
      ignoreExpiration:false,
      secretOrKey: process.env.JWT_SECRET 
  })
  }

  async validate(payload: any) {
    return { 
      id: payload.sub, 
      username: payload.username, 
      roles: payload.roles 
    };
  }
}