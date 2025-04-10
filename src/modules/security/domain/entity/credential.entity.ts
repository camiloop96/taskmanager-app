import { User } from "./user.entity";

export class Credentials {
  private _id: string | null;
  private _username: string;
  private _password: string;
  private _isActive: boolean;
  private _lastLogin: Date | null;
  private _user: User | null;

  constructor(params: {
    id?: string | null;
    username: string;
    password: string;
    isActive?: boolean;
    lastLogin?: Date | null;
    user?: User | null;
  }) {
    this._id = params.id ?? null;
    this._username = params.username;
    this._password = params.password;
    this._isActive = params.isActive ?? false;
    this._lastLogin = params.lastLogin ?? null;
    this._user = params.user ?? null;
  }

  // Getters
  getId(): string | null {
    return this._id;
  }

  getUsername(): string {
    return this._username;
  }

  getPassword(): string {
    return this._password;
  }

  getIsActive(): boolean {
    return this._isActive;
  }

  getLastLogin(): Date | null {
    return this._lastLogin;
  }

  getUser(): User | null {
    return this._user;
  }

  // Setters
  setUsername(value: string) {
    this._username = value;
  }

  setPassword(value: string) {
    this._password = value;
  }

  setIsActive(value: boolean) {
    this._isActive = value;
  }

  setLastLogin(value: Date | null) {
    this._lastLogin = value;
  }

  setUser(user: User | null) {
    this._user = user;
  }
}
