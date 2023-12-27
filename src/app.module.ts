import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DishController } from './dish/dish.controller';
import { DishService } from './dish/dish.service';
import { DishModule } from './dish/dish.module';
import { PrismaModule } from './prisma/prisma.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [DishModule, PrismaModule, ImagesModule],
  controllers: [AppController, DishController],
  providers: [AppService, DishService],
})
export class AppModule {}
