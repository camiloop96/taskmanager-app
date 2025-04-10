import { Task } from "@tasks/domain/entity/task.entity";
import { Credentials } from "./credential.entity";

export class User {
  private _id: string | null;
  private _fullName: string;
  private _role: string;
  private _credentials: Credentials | null;
  private _tasks: Task[];

  constructor(params: {
    id?: string | null;
    fullName: string;
    role: string;
    credentials: Credentials | null;
    tasks: Task[];
  }) {
    this._id = params.id ?? null;
    this._fullName = params.fullName;
    this._role = params.role;
    this._credentials = params.credentials ?? null;
    this._tasks = params.tasks ?? [];
  }

  // Getters
  getId(): string | null {
    return this._id;
  }

  getFullName(): string {
    return this._fullName;
  }

  getRole(): string {
    return this._role;
  }

  getCredentials(): Credentials {
    return this._credentials!;
  }

  getCredentialsId(): string | null {
    return this._credentials ? this._credentials.getId() : null;
  }

  getTasks(): Task[] {
    return this._tasks;
  }

  // Setters
  setId(value: string | null): void {
    this._id = value;
  }

  setFullName(value: string): void {
    this._fullName = value;
  }

  setRole(value: string): void {
    this._role = value;
  }

  setTasks(value: Task[]): void {
    this._tasks = value;
  }

  addTask(task: Task): void {
    this._tasks.push(task);
  }

  setCredentials(value: Credentials): void {
    this._credentials = value;
  }

  removeTask(taskId: string): void {
    this._tasks = this._tasks.filter((task) => task.getId() !== taskId);
  }
}
