import { User } from "@security/domain/entity/user.entity";

export class Task {
  private _id: string | null;
  private _title: string;
  private _description: string;
  private _status: "TODO" | "IN_PROGRESS" | "DONE";
  private _dueDate: Date;
  private _user: User;

  constructor(params: {
    id?: string | null;
    title: string;
    description: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    dueDate: Date;
    user: User;
  }) {
    this._id = params.id ?? null;
    this._title = params.title;
    this._description = params.description;
    this._status = params.status;
    this._dueDate = params.dueDate;
    this._user = params.user;
  }

  // Getters
  getId(): string | null {
    return this._id;
  }

  getTitle(): string {
    return this._title;
  }

  getDescription(): string {
    return this._description;
  }

  getStatus(): "TODO" | "IN_PROGRESS" | "DONE" {
    return this._status;
  }

  getDueDate(): Date {
    return this._dueDate;
  }

  getUser(): User {
    return this._user;
  }

  // Setters
  setId(value: string | null): void {
    this._id = value;
  }

  setTitle(value: string): void {
    this._title = value;
  }

  setDescription(value: string): void {
    this._description = value;
  }

  setStatus(value: "TODO" | "IN_PROGRESS" | "DONE"): void {
    this._status = value;
  }

  setDueDate(value: Date): void {
    this._dueDate = value;
  }

  setUser(value: User): void {
    this._user = value;
  }

  // Métodos para modificar la tarea
  updateTask(
    title?: string,
    description?: string,
    status?: "TODO" | "IN_PROGRESS" | "DONE",
    dueDate?: Date
  ): void {
    if (title) this._title = title;
    if (description) this._description = description;
    if (status) this._status = status;
    if (dueDate) this._dueDate = dueDate;
  }
}
