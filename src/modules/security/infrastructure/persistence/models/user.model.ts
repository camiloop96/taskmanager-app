import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CredentialsModel } from "./credential.model";
import { TaskModel } from "@tasks/infrastructure/persistence/models/task.model";

@Entity("users")
export class UserModel {
  /** users.id */
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: string;

  /** users.full_name */
  @Column({ name: "full_name" })
  fullName!: string;

  /** users.role */
  @Column({ name: "role" })
  role!: string;

  /** users.credentials_id -> credentials.id */
  @OneToOne(() => CredentialsModel, (credentials) => credentials.user, {
    eager: false,
  })
  @JoinColumn({ name: "credentials_id" })
  credentials!: CredentialsModel;

  /** users.tasks -> task.user_id */
  @OneToMany(() => TaskModel, (task) => task.user)
  tasks!: TaskModel[];
}
