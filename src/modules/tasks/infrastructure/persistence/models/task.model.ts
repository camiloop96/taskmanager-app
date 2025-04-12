import { UserModel } from "@security/infrastructure/persistence/models/user.model";
import { TaskStatus } from "@tasks/domain/entity/task-status.enum";

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("tasks")
export class TaskModel {
  /** tasks.id */
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: string;

  /** tasks.title */
  @Column({ name: "title" })
  title!: string;

  /** tasks.description */
  @Column({ name: "description" })
  description!: string;

  /** tasks.status */
  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status!: TaskStatus;

  /** tasks.due_date */
  @Column({ name: "due_date", type: "date" })
  dueDate!: string;

  /** tasks.user_id -> users.id */
  @ManyToOne(() => UserModel, (user) => user.tasks, { eager: false })
  @JoinColumn({ name: "user_id" })
  user!: UserModel;
}
