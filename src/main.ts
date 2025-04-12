import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule } from "@nestjs/swagger";
import { swaggerConfig } from "@config/swagger.config";
import morgan from "morgan";
import { ValidationPipe } from "@nestjs/common";
import { morganFormat, morganOptions } from "@config/morgan.config";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  app.enableCors({
    origin: true,
    allowedHeaders: "Content-Type, Authorization, Accept",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    credentials: true, // Si usas cookies o autenticación
  });

  // Middleware de morgan
  app.use(morgan(morganFormat, morganOptions));

  // Cookie parser
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Server
  const port = process.env.PORT || 3000;
  await app.listen(port, "0.0.0.0");

  // Logs
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(
    `📄 Documentación Swagger disponible en http://localhost:${port}/api`
  );
}

bootstrap();
