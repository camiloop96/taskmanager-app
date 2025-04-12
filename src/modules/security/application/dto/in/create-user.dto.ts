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
