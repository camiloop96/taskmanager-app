import { Injectable } from "@nestjs/common";
import { PasswordEncryptionService } from "@security/domain/service/password.service";

import * as bcrypt from "bcrypt";

@Injectable()
export class PasswordEncryptionServiceImpl
  implements PasswordEncryptionService
{
  private readonly saltRounds = 10;

  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
