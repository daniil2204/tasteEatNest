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

export class AddItemToBucketRequestDTO {
  @IsNumber()
  @IsPositive()
  dishId: number;
}

export class ChangeBucketCountRequestDTO {
  @IsNumber()
  @IsPositive()
  dishId: number;
  @IsNumber()
  @IsPositive()
  count: number;
  @IsNumber()
  @IsPositive()
  bucketId: number;
}
