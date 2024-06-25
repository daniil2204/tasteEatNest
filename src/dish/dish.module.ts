import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [PrismaModule, ImagesModule],
  controllers: [DishController],
  providers: [
    DishService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [DishService],
})
export class DishModule {}
