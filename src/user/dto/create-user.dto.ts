import { IAdress } from '../interfaces/address.interface';

export class CreateUserDto {
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
}
