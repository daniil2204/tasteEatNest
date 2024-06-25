import { BadRequestException, Injectable } from '@nestjs/common';
import { Bucket } from '@prisma/client';
import { DishService } from 'src/dish/dish.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { changeCountInterface } from 'types/bucket';

@Injectable()
export class BucketService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dishService: DishService,
  ) {}
  async addItemToBucket(userId: number, dishId: number, count: number) {
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
      const bucketByUser = dish.bucket.find(
        (item) => item.userId === userId && item.dishId === dishId,
      );
      if (bucketByUser) {
        return this.changeItemCount({
          bucketId: bucketByUser.id,
          count: count,
          userId: userId,
          dishId: dishId,
        });
      } else {
        const bucket = await this.prismaService.bucket.create({
          data: {
            count: count,
            price: dish.price * count,
            dishId: dishId,
            userId: userId,
          },
        });
        return bucket;
      }
    } catch (err) {
      throw new BadRequestException();
    }
  }

  private async changeItemCount({
    dishId,
    count,
    bucketId,
    userId,
  }: changeCountInterface) {
    try {
      if (count === 0) {
        return this.deleteItemFromBucket(bucketId, userId);
      } else {
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
      }
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
    } catch (err) {
      throw new BadRequestException();
    }
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
  async getBucketByDishIdAndUserId(userId: number, dishId: number) {
    const bucket = await this.prismaService.bucket.findFirst({
      where: {
        dishId: dishId,
        userId: userId,
      },
    });
    return bucket;
  }
  async getBucketByUserId(userId: number) {
    try {
      const bucket = await this.prismaService.bucket.findMany({
        where: {
          userId: userId,
        },
      });
      return this.getDishesWithTitleAndImage(bucket);
    } catch (err) {
      throw new BadRequestException('Error');
    }
  }
  async getDishesWithTitleAndImage(bucket: Bucket[]) {
    const newBucket = [];
    for (let i = 0; i < bucket.length; i++) {
      const { title, images, price, discount } =
        await this.dishService.getDishById(bucket[i].dishId);
      const bucketWithDish = {
        ...bucket[i],
        title,
        image: images[0].url,
        price,
        discount,
      };
      newBucket.push(bucketWithDish);
    }
    return newBucket;
  }
}
