import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "@security/domain/service/token.service";

@Injectable()
export class TokenServiceImpl implements TokenService {
  constructor(private jwtService: JwtService) {}

  createToken(payload: object): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): object | null {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  decodeToken(token: string): object | null {
    return this.jwtService.decode(token) as object | null;
  }
}
