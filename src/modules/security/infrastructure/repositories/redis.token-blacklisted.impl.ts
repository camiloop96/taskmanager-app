import { RedisService } from "@config/redis.config";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { TokenBlacklistRepository } from "modules/security/domain/repository/token-blacklist.repository";

@Injectable()
export class RedisTokenBlacklistRepository implements TokenBlacklistRepository {
  constructor(private readonly redisService: RedisService) {}

  async addToBlacklist(token: string, expiresIn: number): Promise<void> {
    try {
      console.log(token, expiresIn)
      await this.redisService.set(`blacklist:${token}`, "blacklisted", {
        EX: expiresIn,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al agregar token a la blacklist"
      );
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    try {
      return (
        (await this.redisService.get(`blacklist:${token}`)) === "blacklisted"
      );
    } catch (error) {
      throw new InternalServerErrorException("Error al verificar la blacklist");
    }
  }
}
