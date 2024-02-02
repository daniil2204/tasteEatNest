import { DishType } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  IsNumber,
  IsEnum,
  IsPositive,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';

export class ImageDTO {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class DishCreateRequestDTO {
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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDTO)
  images: ImageDTO[];
}

export class DishUpdateRequestDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsOptional()
  @IsEnum(DishType)
  type: DishType;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  weight: number;
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  ingredients: string[];
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDTO)
  images: ImageDTO[];
}

export class DishCreateResponceDTO {
  id: number;
  title: string;
  description: string;
  type: DishType;
  price: number;
  weight: number;
  ingredients: string[];
  images: ImageDTO[];
  discount: number;
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

export class DishByTypeResponceDTO {
  id: number;
  title: string;
  description: string;
  @Exclude()
  type: DishType;
  price: number;
  @Exclude()
  weight: number;
  @Exclude()
  ingredients: string[];
  image: string;
  @Exclude()
  images: ImageDTO[];
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
