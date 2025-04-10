import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Credentials } from "@security/domain/entity/credential.entity";
import { QueryRunner, Repository } from "typeorm";
import { CredentialsModel } from "../models/credential.model";
import { CredentialsRepository } from "@security/domain/repository/credential.repository";

@Injectable()
export class CredentialsRepositoryImpl implements CredentialsRepository {
  constructor(
    @InjectRepository(CredentialsModel)
    private readonly repo: Repository<CredentialsModel>
  ) {}

  /** CREATE CREDENTIALS */
  async create(
    credentials: Credentials,
    queryRunner: QueryRunner
  ): Promise<Credentials> {
    const credentialsModel = this.toPersistence(credentials);
    const repo =
      queryRunner?.manager.getRepository(CredentialsModel) ?? this.repo;
    const savedModel = await repo.save(credentialsModel);
    return this.toDomain(savedModel);
  }

  /** FIND CREDENTIALS BY ID */
  async findById(id: string): Promise<Credentials | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  /** FIND CREDENTIALS BY USERNAME */
  async findByUsername(username: string): Promise<Credentials | null> {
    const found = await this.repo.findOne({ where: { username } });
    return found ? this.toDomain(found) : null;
  }

  /** FIND ALL CREDENTIALS */
  async findAll(): Promise<Credentials[]> {
    const found = await this.repo.find();
    return found.map((model) => this.toDomain(model));
  }

  /** UPDATE CREDENTIALS */
  async update(
    id: string,
    credentials: Partial<Credentials>,
    queryRunner: QueryRunner
  ): Promise<Credentials | null> {
    const partialModel: Partial<CredentialsModel> = {
      id: credentials.getId?.() || undefined,
      username: credentials.getUsername?.() || undefined,
      password: credentials.getPassword?.() || undefined,
      isActive:
        credentials.getIsActive?.() !== undefined
          ? credentials.getIsActive()
          : undefined,
      lastLogin: credentials.getLastLogin?.() || undefined,
    };
    const repo =
      queryRunner?.manager.getRepository(CredentialsModel) ?? this.repo;

    await repo.update(id, partialModel);
    const updated = await this.repo.findOne({ where: { id } });
    return updated ? this.toDomain(updated) : null;
  }

  /** DELETE CREDENTIALS */
  async delete(id: string, queryRunner: QueryRunner): Promise<void> {
    const repo =
      queryRunner?.manager.getRepository(CredentialsModel) ?? this.repo;
    await repo.delete(id);
  }

  /** MAP DOMAIN TO PERSISTENCE */
  private toPersistence(entity: Credentials): CredentialsModel {
    const model = new CredentialsModel();
    if (!entity.getUsername() || !entity.getPassword()) {
      throw new Error("Missing required fields");
    }
    model.username = entity.getUsername();
    model.password = entity.getPassword();
    model.isActive = entity.getIsActive();
    model.lastLogin = entity.getLastLogin()!;
    return model;
  }

  /** MAP PERSISTENCE TO DOMAIN */
  private toDomain(model: CredentialsModel): Credentials {
    return new Credentials({
      id: model.id,
      username: model.username,
      password: model.password,
      isActive: model.isActive,
      lastLogin: model.lastLogin,
    });
  }
}
