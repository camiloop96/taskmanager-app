import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsUUID,
  IsDate,
} from "class-validator";

export class CreateTaskDto {
  @ApiProperty({
    example: "Tarea de ejemplo",
    description: "Título de la tarea",
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: "Esta es una descripción detallada de la tarea.",
    description: "Descripción de la tarea",
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: "TODO",
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    description: "Estado de la tarea",
  })
  @IsEnum(["TODO", "IN_PROGRESS", "DONE"])
  status!: "TODO" | "IN_PROGRESS" | "DONE";

  @ApiProperty({
    example: "2025-04-30T23:59:59.000Z",
    description: "Fecha de vencimiento de la tarea",
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dueDate!: Date;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID del usuario asignado a la tarea",
  })
  @IsUUID()
  userId!: string;

  constructor(params: {
    title: string;
    description: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    dueDate: Date;
    userId: string;
  }) {
    this.title = params.title;
    this.description = params.description;
    this.status = params.status;
    this.dueDate = params.dueDate;
    this.userId = params.userId;
  }
}
