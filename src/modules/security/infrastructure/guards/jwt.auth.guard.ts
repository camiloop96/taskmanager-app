import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TokenBlacklistRepository } from "modules/security/domain/repository/token-blacklist.repository";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private readonly tokenBlacklistRepository: TokenBlacklistRepository
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException("Token not provided");
    }

    // ✅ Elimina el prefijo "Bearer " si está presente
    token = token.replace(/^Bearer\s+/i, "");

    // ❌ Verificar si el token está en la blacklist
    if (await this.tokenBlacklistRepository.isBlacklisted(token)) {
      throw new UnauthorizedException("Token revoked");
    }


    request.token = token;

    return (await super.canActivate(context)) as boolean;
  }
}
