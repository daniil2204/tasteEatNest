import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { UserInterceptorType } from 'types/user';
import { BucketService } from './bucket.service';
import { AddItemToBucketRequestDTO } from './dto/bucket.dto';

@Controller('bucket')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}
  @Get('')
  async getBucketByUserId(@User() user: UserInterceptorType) {
    const userId = user.id;
    if (userId) {
      return this.bucketService.getBucketByUserId(userId);
    } else {
      throw new BadRequestException('User not founded');
    }
  }
  @Post('/add')
  async addItemToBucket(
    @User() user: UserInterceptorType,
    @Body() addItemToBucketInfo: AddItemToBucketRequestDTO,
  ) {
    const userId = user.id;
    if (userId) {
      return this.bucketService.addItemToBucket(
        user.id,
        addItemToBucketInfo.dishId,
        addItemToBucketInfo.count,
      );
    } else {
      throw new BadRequestException('User not founded');
    }
  }
  @Delete('/:id')
  async deleteItemFromBucket(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInterceptorType,
  ) {
    const userId = user.id;
    if (userId) {
      this.bucketService.deleteItemFromBucket(id, user.id);
    } else {
      throw new BadRequestException('User not founded');
    }
  }
  @Get('/:id')
  async getBucketByDishIdAndUserId(
    @User() user: UserInterceptorType,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = user.id;
    if (userId) {
      return this.bucketService.getBucketByDishIdAndUserId(userId, id);
    } else {
      throw new BadRequestException('User not founded');
    }
  }
}
