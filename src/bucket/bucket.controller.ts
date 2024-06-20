import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { UserInterceptorType } from 'types/user';
import { BucketService } from './bucket.service';
import { AddItemToBucketRequestDTO } from './dto/bucket.dto';

@Controller('bucket')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}
  @Post('/add')
  async addItemToBucket(
    @User() user: UserInterceptorType,
    @Body() addItemToBucketInfo: AddItemToBucketRequestDTO,
  ) {
    return this.bucketService.addItemToBucket(
      user.id,
      addItemToBucketInfo.dishId,
      addItemToBucketInfo.count,
    );
  }
  // @Post('/changeCount/:id')
  // async changeBucketCount(
  //   @Param('id', ParseIntPipe) userId: number,
  //   @Body() changeBucketCountInfo: ChangeBucketCountRequestDTO,
  // ) {
  //   const { bucketId, count, dishId } = changeBucketCountInfo;
  //   return this.bucketService.changeItemCount({
  //     bucketId,
  //     count,
  //     dishId,
  //     userId,
  //   });
  // }
  @Delete('/:id')
  async deleteItemFromBucket(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInterceptorType,
  ) {
    this.bucketService.deleteItemFromBucket(id, user.id);
  }
}
