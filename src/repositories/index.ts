import { ICreateUser, IUser } from "../entities/intex";

export interface IRepositoryUser {
  createUser(user: ICreateUser): Promise<IUser>;
  getUser(username: string): Promise<IUser>;
}

export interface IRepositoryBlacklist {
  addToBlacklist(token: string): Promise<void>;
  isBlacklist(token: string): Promise<boolean>;
}
