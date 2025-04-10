import { CreateUserDto } from "@security/application/dto/in/create-user.dto";
import { User } from "../entity/user.entity";
import { UpdateUserDto } from "@security/application/dto/in/update-user.dto";

export abstract class UserService {
  abstract createUser(createUserDto: CreateUserDto): Promise<User>;
  abstract getUserById(id: string): Promise<User | null>;
  abstract getAllUsers(): Promise<User[]>;
  abstract updateUser(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<User | null>;
  abstract deleteUser(id: string): Promise<void>;
}
