import { IUser } from "./user.model";

export interface IResponseLogin {
  user: IUser;
  token: string;
}

export interface IResponseO<T> {
  result: boolean;
  data: T;
  message: string;
}

export interface IResponseL<T> {
  result: boolean;
  data: T[];
  message: string;
}
