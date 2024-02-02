import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DishController } from './dish/dish.controller';
import { DishService } from './dish/dish.service';
import { DishModule } from './dish/dish.module';
import { PrismaModule } from './prisma/prisma.module';
import { ImagesModule } from './images/images.module';
import { UserModule } from './user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptor/user.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { BucketModule } from './bucket/bucket.module';

@Module({
  imports: [DishModule, PrismaModule, ImagesModule, UserModule, BucketModule],
  controllers: [AppController, DishController],
  providers: [
    AppService,
    DishService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
