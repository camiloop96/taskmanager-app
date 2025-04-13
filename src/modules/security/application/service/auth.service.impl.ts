import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CredentialsRepository } from "@security/domain/repository/credential.repository";
import { UserRepository } from "@security/domain/repository/user.repository";
import { AuthService } from "@security/domain/service/auth.service";
import { AuthResponseDto } from "../dto/out/login.response.dto";
import { LoginDto } from "../dto/in/login.dto";
import bcrypt from "bcrypt";
import { UserResponseDto } from "../dto/out/user.response.dto";
import { Credentials } from "@security/domain/entity/credential.entity";
import { User } from "@security/domain/entity/user.entity";
import { CreateUserDto } from "../dto/in/create-user.dto";
import { Role } from "@security/domain/entity/roles.enum";
import { CredentialsModel } from "@security/infrastructure/persistence/models/credential.model";
import { DataSource } from "typeorm";
import { runInTransaction } from "@common/transaction.util";
import { CreateUserResponseDto } from "../dto/out/create-user.response.dto";

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource
  ) {}
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => {
      const dto = new UserResponseDto();
      dto.id = user.getId()!;
      dto.fullName = user.getFullName();
      dto.username = user.getCredentials().getUsername();
      dto.role = user.getRole();
      return dto;
    });
  }

  /** 🏷️ Autentica al usuario y retorna el token, rol y datos del usuario */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { username, password } = loginDto;

    const credentials = await this.credentialsRepository.findByUsername(
      username
    );

    if (!credentials) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      credentials.getPassword()
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const user = await this.userRepository.findByCredentialsId(
      credentials.getId()!
    );
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const payload = {
      sub: user.getId(),
      role: user.getRole(),
      username: credentials.getUsername(),
    };
    const token = this.jwtService.sign(payload);

    return new AuthResponseDto(
      token,
      user.getRole(),
      user.getId()!,
      user.getFullName()
    );
  }

  /** 🏷️ Invalida el token y lo agrega a la blacklist */
  async logout(token: string): Promise<void> {
    try {
      const decodedToken = this.jwtService.decode(token) as {
        exp: number;
      } | null;
      if (!decodedToken || !decodedToken.exp) {
        throw new UnauthorizedException("Invalid token");
      }
    } catch (error) {
      throw new UnauthorizedException("Logout failed");
    }
  }

  /** 🏷️ Renueva el access token usando el refresh token */
  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const decodedToken = this.jwtService.verify(refreshToken, {
        secret: "SECRET_REFRESH_KEY",
      });

      if (!decodedToken || !decodedToken.sub) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const user = await this.userRepository.findById(decodedToken.sub);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const payload = {
        sub: user.getId(),
        role: user.getRole(),
        username: user.getCredentials().getUsername(),
      };

      const newAccessToken = this.jwtService.sign(payload);

      return new AuthResponseDto(
        newAccessToken,
        user.getRole(),
        user.getId()!,
        user.getFullName()
      );
    } catch (error) {
      throw new UnauthorizedException("Failed to refresh token");
    }
  }

  async getProfile(token: string): Promise<UserResponseDto> {
    try {
      const decodedToken = this.jwtService.decode(token) as {
        sub: string;
      } | null;

      if (!decodedToken || !decodedToken.sub) {
        throw new UnauthorizedException("Token inválido");
      }

      const userId = decodedToken.sub;

      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new UnauthorizedException("Usuario no encontrado");
      }

      const userResponse = new UserResponseDto();
      userResponse.id = user.getId()!;
      userResponse.fullName = user.getFullName();
      userResponse.role = user.getRole();

      return userResponse;
    } catch (error) {
      throw new UnauthorizedException("No se pudo obtener el perfil");
    }
  }

  async register(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    return await runInTransaction(this.dataSource, async (queryRunner) => {
      const { fullName, username, password } = createUserDto;

      const normalizedUsername = username.trim().toLowerCase();

      const existingCredentials =
        await this.credentialsRepository.findByUsername(normalizedUsername);
      if (existingCredentials) {
        throw new ConflictException("El usuario ya existe");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const credentials = new Credentials({
        username: normalizedUsername,
        password: hashedPassword,
        isActive: false,
        lastLogin: null,
        user: null,
      });

      const user = new User({
        fullName,
        role: Role.USER,
        credentials,
        tasks: [],
      });

      credentials.setUser(user);

      const savedUser = await this.userRepository.create(user, queryRunner);

      const response = new CreateUserResponseDto();
      response.id = savedUser.getId()!;
      response.fullName = savedUser.getFullName();
      (response.username = savedUser.getCredentials().getUsername()),
        (response.role = savedUser.getRole());

      return response;
    });
  }
}
