import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskRepository } from "@tasks/domain/repository/task.repository";
import { Repository, QueryRunner } from "typeorm";
import { Task } from "@tasks/domain/entity/task.entity";
import { TaskModel } from "../models/task.model";
import { TaskMapper } from "@tasks/application/dto/mappers/task.mapper";

@Injectable()
export class TaskRepositoryImpl implements TaskRepository {
  constructor(
    @InjectRepository(TaskModel)
    private readonly repo: Repository<TaskModel>
  ) {}

  /** 🏗️ Crea una nueva tarea */
  async create(task: Task, queryRunner?: QueryRunner): Promise<Task> {
    const model = TaskMapper.toPersistence(task);
    const repository = queryRunner
      ? queryRunner.manager.getRepository(TaskModel)
      : this.repo;
    const savedModel = await repository.save(model);
    return TaskMapper.toDomain(savedModel);
  }

  /** 🧾 Encuentra todas las tareas */
  async findAll(): Promise<Task[]> {
    const models = await this.repo.find({ relations: ["user"] });
    return models.map(TaskMapper.toDomain);
  }

  /** 🔍 Encuentra una tarea por su ID */
  async findById(id: string): Promise<Task | null> {
    const model = await this.repo.findOne({
      where: { id },
      relations: ["user"],
    });
    return model ? TaskMapper.toDomain(model) : null;
  }

  /** 🔁 Actualiza una tarea existente */
  async update(
    id: string,
    task: Task,
    queryRunner?: QueryRunner
  ): Promise<Task> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(TaskModel)
      : this.repo;

    const existing = await repository.findOne({
      where: { id: task.getId()! },
    });

    if (!existing) {
      throw new NotFoundException(`Task with ID ${task.getId()} not found`);
    }

    const merged = repository.merge(existing, TaskMapper.toPersistence(task));
    const updated = await repository.save(merged);
    return TaskMapper.toDomain(updated);
  }

  /** 🗑️ Elimina una tarea por su ID */
  async delete(id: string, queryRunner?: QueryRunner): Promise<void> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(TaskModel)
      : this.repo;

    const result = await repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
