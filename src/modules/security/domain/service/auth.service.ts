import { CreateUserDto } from "@security/application/dto/in/create-user.dto";
import { CreateUserResponseDto } from "@security/application/dto/out/create-user.response.dto";
import { LoginDto } from "modules/security/application/dto/in/login.dto";
import { AuthResponseDto } from "modules/security/application/dto/out/login.response.dto";
import { UserResponseDto } from "modules/security/application/dto/out/user.response.dto";

export abstract class AuthService {
  abstract login(loginDto: LoginDto): Promise<AuthResponseDto>;
  abstract logout(token: string): Promise<void>;
  abstract refreshToken(refreshToken: string): Promise<AuthResponseDto>;
  abstract getProfile(token: string): Promise<UserResponseDto>;
  abstract register(
    createUserDto: CreateUserDto
  ): Promise<CreateUserResponseDto>;
  abstract getAllUsers(): Promise<UserResponseDto[]>;
}
