import { QueryRunner } from "typeorm";
import { Credentials } from "../entity/credential.entity";

export abstract class CredentialsRepository {
  abstract create(
    credentials: Credentials,
    queryRunner?: QueryRunner
  ): Promise<Credentials>;
  abstract findById(id: string): Promise<Credentials | null>;
  abstract findByUsername(
    username: string,
    queryRunner?: QueryRunner
  ): Promise<Credentials | null>;
  abstract findAll(): Promise<Credentials[]>;
  abstract update(
    id: string,
    credentials: Partial<Credentials>,
    queryRunner?: QueryRunner
  ): Promise<Credentials | null>;
  abstract delete(id: string, queryRunner?: QueryRunner): Promise<void>;
}
