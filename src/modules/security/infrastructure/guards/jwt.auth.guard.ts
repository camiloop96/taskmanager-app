import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.headers.authorization);
    const authHeader = request.headers.authorization;

    // Validacion del token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Bearer token requerido en el header");
    }

    // Extraer el token del header
    const token = authHeader.replace(/^Bearer\s+/i, "");

    // Hacerlo accesible desde otros lugares si se necesita
    request.token = token;

    // Dejar que Passport haga su validación
    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
