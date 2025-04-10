/** CREATE USER DTO */
export class CreateUserDto {
  fullName!: string;
  email!: string;
  phoneNumber?: string;
  role!: string;
  tenantId!: string;

  /** CREDENTIALS */
  username!: string;
  password!: string;
}

/** UPDATE USER DTO */
export class UpdateUserDto {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  tenantId?: string;
}
