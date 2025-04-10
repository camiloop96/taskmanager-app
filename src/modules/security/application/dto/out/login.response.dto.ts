import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  token: string;

  @ApiProperty({
    example: "TENANT_USER",
    enum: ["SYS_ADMIN", "TENANT_USER", "TENANT_COURIER"],
  })
  role: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  userId: string;

  @ApiProperty({ example: "John Doe" })
  fullName: string;

  constructor(token: string, role: string, userId: string, fullName: string) {
    this.token = token;
    this.role = role;
    this.userId = userId;
    this.fullName = fullName;
  }
}
