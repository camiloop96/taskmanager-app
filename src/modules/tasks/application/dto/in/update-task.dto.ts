import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEnum,
  IsDateString,
  IsUUID,
  IsOptional,
} from "class-validator";

export class UpdateTaskDto {
  @ApiProperty({
    example: "Tarea de ejemplo",
    description: "Título de la tarea",
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: "Esta es una descripción detallada de la tarea.",
    description: "Descripción de la tarea",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: "TODO",
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    description: "Estado de la tarea",
    required: false,
  })
  @IsOptional()
  @IsEnum(["TODO", "IN_PROGRESS", "DONE"])
  status?: "TODO" | "IN_PROGRESS" | "DONE";

  @ApiProperty({
    example: "2025-04-30T23:59:59.000Z",
    description: "Fecha de vencimiento de la tarea",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID del usuario asignado a la tarea",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    example: "John Doe",
    description: "Nombre completo del usuario asignado",
    required: false,
  })
  @IsOptional()
  @IsString()
  userFullName?: string;

  constructor(params: {
    title?: string;
    description?: string;
    status?: "TODO" | "IN_PROGRESS" | "DONE";
    dueDate?: Date;
    userId?: string;
    userFullName?: string;
  }) {
    this.title = params.title;
    this.description = params.description;
    this.status = params.status;
    this.dueDate = params.dueDate;
    this.userId = params.userId;
    this.userFullName = params.userFullName;
  }
}
