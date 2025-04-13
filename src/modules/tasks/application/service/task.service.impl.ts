import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskService } from "@tasks/domain/service/task.service";
import { CreateTaskDto } from "@tasks/application/dto/in/create-task.dto";
import { UpdateTaskDto } from "@tasks/application/dto/in/update-task.dto";
import { TaskResponseDto } from "@tasks/application/dto/out/task-response.dto";
import { Task } from "@tasks/domain/entity/task.entity";
import { TaskRepository } from "@tasks/domain/repository/task.repository";
import { UserService } from "@security/domain/service/user.service";
import { Role } from "@security/domain/entity/roles.enum";

@Injectable()
export class TaskServiceImpl implements TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userService: UserService
  ) {}

  /** 🏷️ Crea una nueva tarea */
  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string
  ): Promise<TaskResponseDto> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const task = new Task({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status,
      dueDate: new Date(createTaskDto.dueDate),
      user: user,
    });

    const created = await this.taskRepository.create(task);

    return new TaskResponseDto({
      id: created.getId()!,
      title: created.getTitle(),
      description: created.getDescription(),
      status: created.getStatus(),
      dueDate: new Date(created.getDueDate()),
      userId: created.getUser().getId()!,
      userFullName: created.getUser().getFullName(),
    });
  }

  /** 🏷️ Actualiza una tarea por ID */
  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException("Tarea no encontrada");
    }

    // Si se quiere actualizar el usuario, validar que exista
    if (updateTaskDto.userId) {
      const user = await this.userService.getUserById(updateTaskDto.userId);
      if (!user) {
        throw new NotFoundException("Usuario no encontrado");
      }
      task.setUser(user);
    }

    task.setTitle(updateTaskDto.title ?? task.getTitle());
    task.setDescription(updateTaskDto.description ?? task.getDescription());
    task.setStatus(updateTaskDto.status ?? task.getStatus());
    task.setDueDate(updateTaskDto.dueDate ?? task.getDueDate());

    const updated = await this.taskRepository.update(task.getId()!, task);

    if (!updated) {
      throw new NotFoundException("La tarea no pudo ser actualizada");
    }

    return new TaskResponseDto({
      id: updated.getId()!,
      title: updated.getTitle(),
      description: updated.getDescription(),
      status: updated.getStatus(),
      dueDate: updated.getDueDate(),
      userId: updated.getUser().getId()!,
      userFullName: updated.getUser().getFullName(),
    });
  }

  /** 🏷️ Elimina una tarea por ID */
  async deleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException("Tarea no encontrada");
    }

    await this.taskRepository.delete(id);
  }

  /** 🏷️ Obtiene una tarea por ID */
  async getTaskById(id: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException("Tarea no encontrada");
    }

    return new TaskResponseDto({
      id: task.getId()!,
      title: task.getTitle(),
      description: task.getDescription(),
      status: task.getStatus(),
      dueDate: task.getDueDate(),
      userId: task.getUser().getId()!,
      userFullName: task.getUser().getFullName(),
    });
  }

  /** 🏷️ Obtiene todas las tareas */
  async getAllTasks(userId: string, role: Role): Promise<TaskResponseDto[]> {
    let tasks: Task[];

    if (role === Role.ADMIN) {
      tasks = await this.taskRepository.findAll();
    } else {
      tasks = (await this.taskRepository.findByUserId(userId)) ?? null;
    }

    return tasks?.map(
      (task) =>
        new TaskResponseDto({
          id: task.getId()!,
          title: task.getTitle(),
          description: task.getDescription(),
          status: task.getStatus(),
          dueDate: task.getDueDate(),
          userId: task.getUser().getId()!,
          userFullName: task.getUser().getFullName(),
        })
    );
  }
}
