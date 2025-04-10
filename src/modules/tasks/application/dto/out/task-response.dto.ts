import { ApiProperty } from "@nestjs/swagger";

export class TaskResponseDto {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID de la tarea",
  })
  id!: string;

  @ApiProperty({
    example: "Tarea de ejemplo",
    description: "Título de la tarea",
  })
  title!: string;

  @ApiProperty({
    example: "Esta es una descripción detallada de la tarea.",
    description: "Descripción de la tarea",
  })
  description!: string;

  @ApiProperty({
    example: "TODO",
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    description: "Estado de la tarea",
  })
  status!: "TODO" | "IN_PROGRESS" | "DONE";

  @ApiProperty({
    example: "2025-04-30T23:59:59.000Z",
    description: "Fecha de vencimiento de la tarea",
  })
  dueDate!: Date;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID del usuario asignado a la tarea",
  })
  userId!: string;

  @ApiProperty({
    example: "John Doe",
    description: "Nombre completo del usuario asignado",
  })
  userFullName!: string;

  constructor(params: {
    id: string;
    title: string;
    description: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    dueDate: Date;
    userId: string;
    userFullName: string;
  }) {
    this.id = params.id;
    this.title = params.title;
    this.description = params.description;
    this.status = params.status;
    this.dueDate = params.dueDate;
    this.userId = params.userId;
    this.userFullName = params.userFullName;
  }
}
