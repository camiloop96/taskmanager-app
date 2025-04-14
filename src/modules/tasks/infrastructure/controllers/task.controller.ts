import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@security/infrastructure/guards/jwt.auth.guard";
import { TaskService } from "@tasks/domain/service/task.service";
import { CreateTaskDto } from "@tasks/application/dto/in/create-task.dto";
import { UpdateTaskDto } from "@tasks/application/dto/in/update-task.dto";
import { TaskResponseDto } from "@tasks/application/dto/out/task-response.dto";
import { RolesGuard } from "@security/infrastructure/guards/roles.guard";
import { Roles } from "@common/decorators/roles.decorators";
import { Role } from "@security/domain/entity/roles.enum";
import { TaskStatus } from "@tasks/domain/entity/task-status.enum";
import { TaskFilters } from "@tasks/domain/interfaces/task-filters.type";

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
  @ApiBearerAuth("jwt-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
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
  @ApiBearerAuth("jwt-auth")
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
  @ApiBearerAuth("jwt-auth")
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

  @ApiBearerAuth("jwt-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiQuery({
    name: "status",
    enum: TaskStatus,
    required: false,
  })
  @ApiQuery({
    name: "dueDate",
    required: false,
    description: "Fecha límite en formato YYYY-MM-DD o ISO (ej: 2025-04-20)",
    example: "2025-04-20",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Número de página para paginación",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Cantidad de resultados por página",
    example: 10,
  })
  @Get()
  @ApiResponse({
    status: 200,
    description: "Lista de tareas obtenida exitosamente",
    type: [TaskResponseDto],
  })
  async getAllTasks(
    @Req() request: any,
    @Query("status") status?: TaskStatus,
    @Query("dueDate") dueDate?: string,
    @Query("page") page = "1",
    @Query("limit") limit = "10"
  ) {
    const { role, userId } = request.user;
    const filters: TaskFilters = {
      status,
      dueDate,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const tasks = await this.taskService.getAllTasks(userId, role, filters);
    return {
      statusCode: 200,
      message: "Lista de tareas obtenida exitosamente",
      data: tasks,
    };
  }
}
