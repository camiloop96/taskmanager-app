import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiBody } from "@nestjs/swagger";
import { CreateUserDto } from "../../application/dto/in/user.dto";
import { UserResponseDto } from "modules/security/application/dto/out/user.response.dto";
import { UserService } from "modules/security/domain/services/user.service";

@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 🏗️ Crea un nuevo usuario */
  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: "Usuario creado exitosamente",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos inválidos o incompletos",
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  /** 🔍 Obtiene la lista de todos los usuarios */
  @Get()
  @ApiResponse({
    status: 200,
    description: "Lista de usuarios obtenida correctamente",
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: "No se encontraron usuarios",
  })
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
