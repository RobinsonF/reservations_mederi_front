export interface IEquipment {
  id: number;
  name: string;
  description: string;
  quantity: number;
  createdAt: string;
  active: boolean;
  RoomEquipment: RoomEquipment;
}

export interface RoomEquipment {
  id: number;
  roomId: number;
  equipmentId: number;
  quantity: number;
  createdAt: string;
  active: boolean;
}

export interface ICreateEquipment extends Omit<IEquipment, 'id' | 'createdAt' | 'RoomEquipment'> {

}
