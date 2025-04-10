import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskModel } from "./infrastructure/persistence/models/task.model";
import { TaskService } from "./domain/service/task.service";
import { TaskServiceImpl } from "./application/service/task.service.impl";
import { TaskRepository } from "./domain/repository/task.repository";
import { TaskRepositoryImpl } from "./infrastructure/persistence/repositories/task.repository.impl";
import { TaskController } from "./infrastructure/controllers/task.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TaskModel])],
  providers: [
    {
      provide: TaskService,
      useClass: TaskServiceImpl,
    },
    { provide: TaskRepository, useClass: TaskRepositoryImpl },
  ],
  controllers: [TaskController],
  exports: [TaskService, TaskRepository],
})
export class TaskModule {}
