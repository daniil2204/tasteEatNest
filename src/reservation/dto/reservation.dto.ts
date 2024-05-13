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
  Max,
  Min,
} from 'class-validator';

export class ReservationCreateRequestDTO {
  @Max(31)
  @IsNumber()
  @IsPositive()
  day: number;
  @IsNumber()
  @IsPositive()
  @Max(12)
  month: number;
  @IsNumber()
  @IsPositive()
  @Min(2024)
  year: number;
  @IsNumber()
  @IsPositive()
  bookHours: number;
  @IsNumber()
  @IsPositive()
  tableId: number;
}

export class ReservationCreateResponceDTO {
  tableId: number;
  day: number;
  year: number;
  month: number;
  userId: number;
  constructor(partiall: Partial<ReservationCreateResponceDTO>) {
    Object.assign(this, partiall);
  }
}
