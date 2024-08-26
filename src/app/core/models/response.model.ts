import { IUser } from "./user.model";

export interface IResponseLogin {
  user: IUser;
  token: string;
}
