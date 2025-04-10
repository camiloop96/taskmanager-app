import { QueryRunner, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "modules/security/domain/entities/user.entity";
import { UserRepository } from "modules/security/domain/repository/user.repository";
import { UpdateUserDto } from "@security/application/dto/in/create-user.dto";
import { UserModel } from "../models/user.model";
import { CredentialsModel } from "../models/credential.model";
import { Credentials } from "modules/security/domain/entities/credential.entity";
import { TenantModel } from "modules/tenant/infrastructure/models/tenant.model";

// 🗃️ Mapper para conversión entre Modelo y Entidad
export class UserMapper {
  static toDomain(model: UserModel): User {
    const credentials = new Credentials({
      id: model.credentials?.id || null,
      username: model.credentials?.username || "",
      password: model.credentials?.password || "",
      isActive: model.credentials?.isActive || false,
      lastLogin: model.credentials?.lastLogin || null,
    });

    return new User({
      id: model.id,
      fullName: model.fullName,
      email: model.email,
      phoneNumber: model.phoneNumber || null,
      role: model.role,
      tenantId: model.tenant?.id!,
      credentials: credentials,
    });
  }

  static toPersistence(user: User): UserModel {
    const model = new UserModel();
    model.fullName = user.getFullName();
    model.email = user.getEmail();
    model.phoneNumber = user.getPhoneNumber() || undefined;
    model.role = user.getRole();
    if (!model.tenant) {
      model.tenant = new TenantModel();
    }
    model.tenant.id = user.getTenantId()!;

    // 🏗️ Crea el objeto completo de CredentialsModel
    if (user.getCredentials()) {
      const credentials = new CredentialsModel();
      credentials.username = user.getCredentials().getUsername();
      credentials.password = user.getCredentials().getPassword();
      credentials.isActive = user.getCredentials().getIsActive();
      credentials.lastLogin = user.getCredentials().getLastLogin();

      model.credentials = credentials;
    }

    return model;
  }
}

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  // 📥 Inyecta el repositorio de TypeORM para la entidad UserModel
  constructor(
    @InjectRepository(UserModel) private repo: Repository<UserModel>
  ) {}

  /** 🏗️ Crea y guarda un nuevo usuario en la base de datos */
  async create(user: User, queryRunner?: QueryRunner): Promise<User> {
    const model = UserMapper.toPersistence(user);
    const repository = queryRunner
      ? queryRunner.manager.getRepository(UserModel)
      : this.repo;
    const savedModel = await repository.save(model);
    return UserMapper.toDomain(savedModel);
  }

  /** 🔍 Retorna todos los usuarios de la base de datos */
  async findAll(): Promise<User[]> {
    const models = await this.repo.find({ relations: ["credentials"] });
    return models.map(UserMapper.toDomain);
  }

  /** 🔍 Busca y retorna un usuario por su ID, o null si no existe */
  async findById(id: string): Promise<User | null> {
    const model = await this.repo.findOne({
      where: { id },
      relations: ["credentials"],
    });
    return model ? UserMapper.toDomain(model) : null;
  }

  /** ♻️ Actualiza un usuario existente por su ID */
  async update(
    id: string,
    userDto: UpdateUserDto,
    queryRunner?: QueryRunner
  ): Promise<User | null> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(UserModel)
      : this.repo;
    const existingUser = await repo.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(existingUser, userDto);
    const updatedUser = await repo.save(existingUser);
    return UserMapper.toDomain(updatedUser);
  }

  /** 🛑 Elimina un usuario por su ID */
  async delete(id: string, queryRunner?: QueryRunner): Promise<void> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(UserModel)
      : this.repo;
    const result = await repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /** 🔍 Busca y retorna un usuario por su credentialsId, o null si no existe */
  async findByCredentialsId(credentialsId: string): Promise<User | null> {
    const model = await this.repo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.credentials", "credentials")
      .where("credentials.id = :credentialsId", { credentialsId })
      .getOne();

    return model ? UserMapper.toDomain(model) : null;
  }
}
