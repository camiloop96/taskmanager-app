import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./infrastructure/controllers/auth.controller";
import { CredentialsRepository } from "./domain/repository/credential.repository";
import { JwtConfigService } from "@config/jwt.config";
import { CredentialsRepositoryImpl } from "./infrastructure/persistence/repositories/credential.repository.impl";
import { UserRepository } from "./domain/repository/user.repository";
import { UserRepositoryImpl } from "./infrastructure/persistence/repositories/user.repository.impl";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModel } from "./infrastructure/persistence/models/user.model";
import { CredentialsModel } from "./infrastructure/persistence/models/credential.model";
import { JwtStrategy } from "./application/strategies/jwt.strategy";
import { JwtAuthGuard } from "./infrastructure/guards/jwt.auth.guard";
import { TokenBlacklistRepository } from "./domain/repository/token-blacklist.repository";
import { RedisTokenBlacklistRepository } from "./infrastructure/persistence/repositories/redis.token-blacklisted.impl";
import { AuthService } from "./domain/service/auth.service";
import { UserService } from "./domain/service/user.service";
import { PasswordEncryptionService } from "./domain/service/password.service";
import { UserServiceImpl } from "./application/service/user.service.impl";
import { AuthServiceImpl } from "./application/service/auth.service.impl";
import { PasswordEncryptionServiceImpl } from "./application/service/password.service.impl";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserModel, CredentialsModel]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
  ],
  providers: [
    JwtAuthGuard,
    JwtStrategy,
    {
      provide: PasswordEncryptionService,
      useClass: PasswordEncryptionServiceImpl,
    },
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
    { provide: CredentialsRepository, useClass: CredentialsRepositoryImpl },
    {
      provide: UserService,
      useClass: UserServiceImpl,
    },
    { provide: UserRepository, useClass: UserRepositoryImpl },
    {
      provide: TokenBlacklistRepository,
      useClass: RedisTokenBlacklistRepository,
    },
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    TokenBlacklistRepository,
    UserRepository,
    CredentialsRepository,
    UserService,
    PasswordEncryptionService,
  ],
})
export class SecurityModule {}
