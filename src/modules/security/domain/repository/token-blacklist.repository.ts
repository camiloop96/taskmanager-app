export abstract class TokenBlacklistRepository {
  abstract addToBlacklist(token: string, expiresIn: number): Promise<void>;
  abstract isBlacklisted(token: string): Promise<boolean>;
}
