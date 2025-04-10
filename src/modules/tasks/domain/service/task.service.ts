import { CreateTaskDto } from "@tasks/application/dto/in/create-task.dto";
import { UpdateTaskDto } from "@tasks/application/dto/in/update-task.dto";
import { TaskResponseDto } from "@tasks/application/dto/out/task-response.dto";

export abstract class TaskService {
  abstract createTask(createTaskDto: CreateTaskDto): Promise<TaskResponseDto>;
  abstract updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto
  ): Promise<TaskResponseDto>;
  abstract deleteTask(id: string): Promise<void>;
  abstract getTaskById(id: string): Promise<TaskResponseDto>;
  abstract getAllTasks(): Promise<TaskResponseDto[]>;
}
