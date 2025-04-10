import { UpdateUserDto } from "modules/security/application/dto/in/user.dto";
import { QueryRunner } from "typeorm";
import { User } from "../entity/user.entity";

export abstract class UserRepository {
  abstract create(user: User, queryRunner?: QueryRunner): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract update(
    id: string,
    user: UpdateUserDto,
    queryRunner?: QueryRunner
  ): Promise<User | null>;
  abstract delete(id: string, queryRunner?: QueryRunner): Promise<void>;
  abstract findByCredentialsId(credentialsId: string): Promise<User | null>;
}
