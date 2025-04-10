// credentials.mapper.ts
import { CredentialsModel } from "@security/infrastructure/persistence/models/credential.model";
import { Credentials } from "@security/domain/entity/credential.entity";

export class CredentialsMapper {
  static toDomain(model: CredentialsModel): Credentials {
    return new Credentials({
      id: model.id,
      username: model.username,
      password: model.password,
      isActive: model.isActive,
      lastLogin: model.lastLogin,
    });
  }

  static toPersistence(entity: Credentials): CredentialsModel {
    const model = new CredentialsModel();
    model.id = entity.getId()!;
    model.username = entity.getUsername();
    model.password = entity.getPassword();
    model.isActive = entity.getIsActive();
    model.lastLogin = entity.getLastLogin()!;
    return model;
  }
}
