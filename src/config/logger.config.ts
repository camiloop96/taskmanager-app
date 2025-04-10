import { LoggerService } from "@nestjs/common";
import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export class AppLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return stack
            ? `[${timestamp}] ${level}: ${message} - Stack: ${stack}`
            : `[${timestamp}] ${level}: ${message}`;
        })
      ),
      transports: [
        // 🖥️ Console output
        new winston.transports.Console(),

        // 🗂️ Daily Rotate File for Errors
        new DailyRotateFile({
          filename: "logs/error-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          level: "error",
          maxFiles: "14d",
        }),

        // 📄 Daily Rotate File for General Logs
        new DailyRotateFile({
          filename: "logs/app-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxFiles: "14d",
        }),
      ],
      exceptionHandlers: [
        new winston.transports.File({ filename: "logs/exceptions.log" }),
      ],
    });
  }

  // ✅ Método para registrar información general
  log(message: any) {
    this.logger.info(message);
  }

  // ❌ Método para registrar errores
  error(message: any, trace?: string) {
    this.logger.error(message, { stack: trace });
  }

  // ⚠️ Método para advertencias
  warn(message: any) {
    this.logger.warn(message);
  }

  // 🛠️ Método para debug
  debug(message: any) {
    this.logger.debug(message);
  }

  // 💬 Método para información más detallada
  verbose(message: any) {
    this.logger.verbose(message);
  }
}
