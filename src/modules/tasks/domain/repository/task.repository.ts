import { QueryRunner } from "typeorm";
import { Task } from "../entity/task.entity";
import { UpdateTaskDto } from "@tasks/application/dto/in/update-task.dto";

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
}
