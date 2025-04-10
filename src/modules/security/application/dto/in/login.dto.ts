import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Nombre de usuario o email",
  })
  @IsEmail()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    example: "password123",
    description: "Contraseña del usuario",
  })
  @IsNotEmpty()
  password!: string;
}
