export interface ICreateUser {
  username: string;
  name: string;
  password: string;
}

export interface IUser extends ICreateUser {
  id: string;
}
