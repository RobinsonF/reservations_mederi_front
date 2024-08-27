import { IReservation } from "./reservation.model";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  active: boolean;
}

export interface ICreateAuthUser extends Omit<IUser, 'id' | 'role' | 'createdAt' | 'active'> {
  password: string;
}

export interface ICreateUser extends Omit<IUser, 'id' | 'createdAt'> {
  password: string;
}

export interface IFindOneUser extends IUser {
  reservations: IReservation[];
}
