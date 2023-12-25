import { DishType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsString,
  IsNumber,
  IsEnum,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export class DishCreateRequetDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsEnum(DishType)
  type: DishType;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNumber()
  @IsPositive()
  weight: number;
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  ingredients: string[];
}

export class DishCreateResponceDTO {
  id: number;
  title: string;
  description: string;
  type: DishType;
  price: number;
  weight: number;
  ingredients: string[];
  @Exclude()
  likes: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updateAt: Date;
  constructor(partiall: Partial<DishCreateResponceDTO>) {
    Object.assign(this, partiall);
  }
}
