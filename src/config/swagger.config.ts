import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Tasks API")
  .setDescription("API para gestionar tareas")
  .setVersion("1.0")
  .addBearerAuth(
    {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "Authorization",
      in: "header",
    },
    "jwt-auth"
  )

  .build();
