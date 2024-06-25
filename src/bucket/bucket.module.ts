import { Module } from '@nestjs/common';
import { BucketController } from './bucket.controller';
import { BucketService } from './bucket.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DishModule } from 'src/dish/dish.module';

@Module({
  imports: [PrismaModule, DishModule],
  controllers: [BucketController],
  providers: [BucketService],
})
export class BucketModule {}
