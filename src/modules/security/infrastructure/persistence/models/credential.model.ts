import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./user.model";

@Entity("credentials")
export class CredentialsModel {
  /** credentials.id */
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /** credentials.username */
  @Column({ unique: true })
  username!: string;

  /** credentials.password */
  @Column()
  password!: string;

  /** credentials.is_active */
  @Column({ name: "is_active", default: false })
  isActive!: boolean;

  /** credentials.last_login */
  @Column({ name: "last_login", type: "timestamp", nullable: true })
  lastLogin?: Date | null;

  /** credentials.id -> users.credentials_id */
  @OneToOne(() => UserModel, (user) => user.credentials)
  user!: UserModel;
}
