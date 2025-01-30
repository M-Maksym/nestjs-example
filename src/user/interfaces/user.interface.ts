import { Document } from 'mongoose';
import { IAdress } from './address.interface';

export interface IUser extends Document {
  readonly email: string;
  readonly avatar: string;
  readonly avatarId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly gender: string;
  readonly address: IAdress;
  readonly profession: string;
  readonly phone: string;
  readonly searchField: string;
  readonly role: Array<string>;
  readonly password: string;
  status: string;
}
