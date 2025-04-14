import { QueryRunner } from "typeorm";
import { Task } from "../entity/task.entity";
import { Role } from "@security/domain/entity/roles.enum";
import { TaskFilters } from "../interfaces/task-filters.type";

export abstract class TaskRepository {
  abstract create(task: Task, queryRunner?: QueryRunner): Promise<Task>;
  abstract findById(id: string): Promise<Task | null>;
  abstract findAll(): Promise<Task[]>;
  abstract update(
    id: string,
    task: Task,
    queryRunner?: QueryRunner
  ): Promise<Task | null>;
  abstract delete(id: string, queryRunner?: QueryRunner): Promise<void>;
  abstract findByUserId(userId: string): Promise<Task[]>;
  abstract findWithFilters(
    userId: string,
    role: Role,
    filters: TaskFilters
  ): Promise<Task[]>;
}
