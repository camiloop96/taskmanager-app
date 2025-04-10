import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Tasks API")
  .setDescription("API para gestionar tareas")
  .setVersion("1.0")
  .addBearerAuth() 
  .build();
