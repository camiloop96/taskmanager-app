import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Nombre de usuario o email",
  })
  username!: string;

  @ApiProperty({
    example: "password123",
    description: "Contraseña del usuario",
  })
  password!: string;
}
