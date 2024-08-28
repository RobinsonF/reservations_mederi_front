import { IRoom } from "./room.model";
import { IUser } from "./user.model";

export interface IReservation {
  id: number;
  roomId: number;
  userId: number;
  startTime: string;
  endTime: string;
  purpose: string;
  status: string;
  createdAt: string;
  active: boolean;
}

export interface IFindAllReservation extends IReservation {
  user: IUser;
  room: IRoom;
}

export interface ICreateReservation extends Omit<IReservation, 'id' | 'createdAt'> {

}
