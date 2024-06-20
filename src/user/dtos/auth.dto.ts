import {
  IsString,
  IsNotEmpty,
  Matches,
  IsEmail,
  Length,
} from 'class-validator';
import { UserType } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class SighUpDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'phone is not valid',
  })
  phone: string;
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}

export class SignInDTO {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}

export class UserResponceDTO {
  id: number;
  name: string;
  phone: string;
  type: UserType;
  token: string;
  @Exclude()
  userSalt: string;
  @Exclude()
  password: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updateAt: Date;
  constructor(partiall: Partial<UserResponceDTO>) {
    Object.assign(this, partiall);
  }
}
