import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsIn } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    example: "Juan Pérez",
    description: "Nombre completo del usuario",
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: "USER",
    description: "Rol del usuario",
    enum: ["ADMIN", "USER"],
    required: false,
  })
  @IsOptional()
  @IsIn(["ADMIN", "USER"])
  role?: string;
}
