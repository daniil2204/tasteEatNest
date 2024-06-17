import { IsNumber, IsPositive, Max, Min } from 'class-validator';

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
  @Max(22)
  @Min(8)
  bookHour: number;
  @IsNumber()
  @IsPositive()
  @Max(3)
  @Min(1)
  hourCount: number;
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
