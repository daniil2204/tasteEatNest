import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

export class AddItemToBucketRequestDTO {
  @IsNumber()
  @IsPositive()
  dishId: number;
  @IsInt()
  @Min(0)
  count: number;
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
