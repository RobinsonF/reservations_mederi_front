import { IEquipment } from "./equipment.mode";
import { IRoom } from "./room.model";

export interface IRoomEquipment {
  id: number;
  roomId: number;
  equipmentId: number;
  quantity: number;
  createdAt: string;
  active: boolean;
  room: IRoom;
  equipment: IEquipment;
}

export interface ICreateRoomEquipment extends Omit<IRoomEquipment, 'id' | 'createdAt' | 'room' | 'equipment'> {

}
