import { IAdress } from './address.interface';

export interface IReadableUser {
  readonly email: string;
  readonly avatar: string;
  readonly avatarId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly gender: string;
  readonly address: IAdress;
  readonly profession: string;
  readonly phone: string;
  readonly roles: Array<string>;
  accessToken?: string;
}
