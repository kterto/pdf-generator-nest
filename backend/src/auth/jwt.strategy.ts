import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_SECRET_KEY } from "./constants";
import { JwtPayload } from "jsonwebtoken";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload) throw new UnauthorizedException();
    return payload;
  }
}
