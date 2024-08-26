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
