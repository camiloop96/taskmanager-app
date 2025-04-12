import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@security/infrastructure/guards/jwt.auth.guard";
import { TaskService } from "@tasks/domain/service/task.service";
import { CreateTaskDto } from "@tasks/application/dto/in/create-task.dto";
import { UpdateTaskDto } from "@tasks/application/dto/in/update-task.dto";
import { TaskResponseDto } from "@tasks/application/dto/out/task-response.dto";
import { RolesGuard } from "@security/infrastructure/guards/roles.guard";
import { Roles } from "@common/decorators/roles.decorators";
import { Role } from "@security/domain/entity/roles.enum";

@ApiTags("Tasks")
@Controller("/tasks")
@ApiSecurity("jwt-auth")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /** ✅ Crear una nueva tarea */
  @ApiBearerAuth("jwt-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Post()
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: "Tarea creada exitosamente",
    type: TaskResponseDto,
  })
  async createTask(@Req() request: any, @Body() createTaskDto: CreateTaskDto) {
    const { userId } = request.user;
    const task = await this.taskService.createTask(createTaskDto, userId);
    return {
      statusCode: 201,
      message: "Tarea creada exitosamente",
      data: task,
    };
  }

  /** 🔁 Actualizar una tarea */
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: "Tarea actualizada exitosamente",
    type: TaskResponseDto,
  })
  async updateTask(
    @Param("id") id: string,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    const updated = await this.taskService.updateTask(id, updateTaskDto);
    return {
      statusCode: 200,
      message: "Tarea actualizada exitosamente",
      data: updated,
    };
  }

  /** ❌ Eliminar una tarea */
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @ApiResponse({ status: 200, description: "Tarea eliminada exitosamente" })
  async deleteTask(@Param("id") id: string) {
    await this.taskService.deleteTask(id);
    return {
      statusCode: 200,
      message: "Tarea eliminada exitosamente",
      data: null,
    };
  }

  /** 🔍 Obtener tarea por ID */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get(":id")
  @ApiResponse({
    status: 200,
    description: "Tarea obtenida exitosamente",
    type: TaskResponseDto,
  })
  async getTaskById(@Param("id") id: string) {
    const task = await this.taskService.getTaskById(id);
    return {
      statusCode: 200,
      message: "Tarea obtenida exitosamente",
      data: task,
    };
  }

  /** 📋 Obtener todas las tareas */
  @ApiBearerAuth("jwt-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Lista de tareas obtenida exitosamente",
    type: [TaskResponseDto],
  })
  async getAllTasks(@Req() request: any) {
    console.log("USERS", request.user);
    const { role, userId } = request.user;
    const tasks = await this.taskService.getAllTasks(userId, role);
    return {
      statusCode: 200,
      message: "Lista de tareas obtenida exitosamente",
      data: tasks,
    };
  }
}
