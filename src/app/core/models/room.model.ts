import { IEquipment } from "./equipment.mode";
import { IReservation } from "./reservation.model";

export interface IRoom {
  id: number;
  name: string;
  location: string;
  capacity: number;
  createdAt: string;
  active: boolean;
}

export interface IFindAllRomm extends IRoom {
  reservations: IReservation[];
}

export interface IFindOneRomm extends IRoom {
  reservations: IReservation[];
  equipment: IEquipment[];
}
