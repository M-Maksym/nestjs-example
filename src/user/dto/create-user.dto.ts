import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { CreateAddressDto } from './create-address.dto';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  readonly avatar: string;
  readonly avatarId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly gender: string;
  @IsOptional()
  @ApiPropertyOptional()
  readonly address: CreateAddressDto;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly profession: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly phone: string;
  readonly searchField: string;
  readonly roles: Array<string>;
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Weak password',
    },
  )
  @ApiProperty()
  readonly password: string;
}
