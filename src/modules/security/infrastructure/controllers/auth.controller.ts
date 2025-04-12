import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "modules/security/application/dto/in/login.dto";
import { AuthResponseDto } from "modules/security/application/dto/out/login.response.dto";
import { JwtAuthGuard } from "../guards/jwt.auth.guard";
import { Response, Request } from "express";
import { AuthService } from "modules/security/domain/service/auth.service";
import { CreateUserDto } from "@security/application/dto/in/create-user.dto";
import { UserResponseDto } from "@security/application/dto/out/user.response.dto";
import { Roles } from "@common/decorators/roles.decorators";
import { Role } from "@security/domain/entity/roles.enum";
import { CreateUserResponseDto } from "@security/application/dto/out/create-user.response.dto";

export interface ExtendedRequest extends Request {
  token?: string;
}

@ApiTags("Auth")
@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** 🔑 Iniciar sesión y obtener el token */
  @Post("login")
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Inicio de sesión exitoso",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Credenciales inválidas",
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(loginDto);
  }

  /** 🔑 Iniciar sesión y obtener el token */
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @ApiResponse({ status: 200, description: "Sesión cerrada exitosamente" })
  @ApiBody({ description: "Token for logout", required: false })
  @ApiResponse({
    status: 401,
    description: "Token inválido o no proporcionado",
  })
  async logout(
    @Req() req: ExtendedRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    const { token } = req;

    if (!token) {
      throw new UnauthorizedException("Token no proporcionado");
    }

    await this.authService.logout(token);

    return {
      statusCode: 200,
      message: "Sesión cerrada exitosamente",
      data: null,
    };
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("jwt-auth")
  @Get("profile")
  @ApiResponse({
    status: 200,
    description: "Datos del perfil obtenidos con éxito",
  })
  @ApiResponse({
    status: 401,
    description: "Token inválido o no proporcionado",
  })
  async getProfile(@Req() req: ExtendedRequest) {
    const token = req.token;

    if (!token) {
      throw new UnauthorizedException("Token inválido");
    }

    const user = await this.authService.getProfile(token);

    return {
      statusCode: 200,
      message: "Usuario obtenido con éxito",
      data: user,
    };
  }

  @Roles(Role.ADMIN)
  @Post("register")
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: "Usuario creado exitosamente",
    type: CreateUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos inválidos o usuario ya existe",
  })
  async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<CreateUserResponseDto> {
    return await this.authService.register(createUserDto);
  }
}
