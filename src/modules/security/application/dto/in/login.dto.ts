import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "admin@taskmanager.com",
    description: "Nombre de usuario o email",
  })
  @IsEmail()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    example: "admin123",
    description: "Contraseña del usuario",
  })
  @IsNotEmpty()
  password!: string;
}
