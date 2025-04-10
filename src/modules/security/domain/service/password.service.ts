export abstract class PasswordEncryptionService {
  abstract hashPassword(plainPassword: string): Promise<string>;
  abstract comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
