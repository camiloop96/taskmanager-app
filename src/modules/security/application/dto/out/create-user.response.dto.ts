import { ApiProperty } from "@nestjs/swagger";

export class CreateUserResponseDto {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID único del usuario",
  })
  id!: string;

  @ApiProperty({
    example: "John Doe",
    description: "Nombre completo del usuario",
  })
  fullName!: string;

  @ApiProperty({ example: "USER", description: "Rol del usuario" })
  role!: string;

  
}
