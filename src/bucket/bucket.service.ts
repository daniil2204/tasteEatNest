import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { changeCountInterface } from 'types/bucket';

@Injectable()
export class BucketService {
  constructor(private readonly prismaService: PrismaService) {}
  async addItemToBucket(userId: number, dishId: number) {
    let errorMsg = 'Dish did not found';
    try {
      const dish = await this.prismaService.dish.findFirst({
        where: {
          id: dishId,
        },
        select: {
          price: true,
          bucket: true,
        },
      });
      if (
        dish.bucket.find(
          (item) => item.dishId === dishId && item.userId === userId,
        )
      ) {
        errorMsg = 'is existed';
        throw new Error();
      }
      const bucket = await this.prismaService.bucket.create({
        data: {
          count: 1,
          price: dish.price,
          dishId,
          userId,
        },
      });
      return bucket;
    } catch (err) {
      throw new BadRequestException(errorMsg);
    }
  }
  async changeItemCount({
    dishId,
    count,
    bucketId,
    userId,
  }: changeCountInterface) {
    try {
      if (count === 0) {
        this.deleteItemFromBucket(bucketId, userId);
      }
      const priceByCount = await this.calculatePrice(dishId, count);
      const bucket = await this.prismaService.bucket.update({
        where: {
          id: bucketId,
          userId,
          dishId,
        },
        data: {
          price: priceByCount,
          count,
        },
      });
      return bucket;
    } catch (err) {
      throw new BadRequestException();
    }
  }
  async deleteItemFromBucket(bucketId: number, userId: number) {
    try {
      await this.prismaService.bucket.delete({
        where: {
          id: bucketId,
          userId,
        },
      });
    } catch (err) {}
  }
  private async calculatePrice(dishId: number, count: number): Promise<number> {
    const priceForItem = await this.prismaService.dish.findUnique({
      where: {
        id: dishId,
      },
      select: {
        price: true,
      },
    });
    return priceForItem.price * count;
  }
}
