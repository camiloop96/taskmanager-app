import { Role } from "@security/domain/entity/roles.enum";
import { CreateTaskDto } from "@tasks/application/dto/in/create-task.dto";
import { UpdateTaskDto } from "@tasks/application/dto/in/update-task.dto";
import { TaskResponseDto } from "@tasks/application/dto/out/task-response.dto";

export abstract class TaskService {
  abstract createTask(
    createTaskDto: CreateTaskDto,
    userId: string
  ): Promise<TaskResponseDto>;
  abstract updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto
  ): Promise<TaskResponseDto>;
  abstract deleteTask(id: string): Promise<void>;
  abstract getTaskById(id: string): Promise<TaskResponseDto>;
  abstract getAllTasks(userId: string, role: Role): Promise<TaskResponseDto[]>;
}
