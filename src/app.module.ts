import { typeOrmConfig } from "@config/typeorm.config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskModule } from "@tasks/tasks.module";
import { SecurityModule } from "modules/security/security.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    SecurityModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
