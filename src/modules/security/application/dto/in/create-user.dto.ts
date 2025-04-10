import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsIn, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    example: "Juan Pérez",
    description: "Nombre completo del usuario",
  })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({
    example: "ADMIN",
    description: "Rol del usuario",
    enum: ["ADMIN", "USER"],
  })
  @IsIn(["ADMIN", "USER"])
  role!: string;

  /** CREDENTIALS */
  @ApiProperty({
    example: "juanperez",
    description: "Nombre de usuario",
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    example: "segura123",
    description: "Contraseña del usuario",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
