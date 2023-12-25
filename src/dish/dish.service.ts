import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createDishInterface } from 'types/dish';
import { DishCreateResponceDTO } from './dto/dish.dto';

@Injectable()
export class DishService {
  constructor(private readonly prismaService: PrismaService) {}
  async getDishes() {
    const dishes = await this.prismaService.dish.findMany({});
    return dishes;
  }
  async getDishById(id: number) {
    const dish = await this.prismaService.dish.findUnique({
      where: {
        id,
      },
    });
    return dish;
  }
  async createDish(createDishData: createDishInterface) {
    const { description, ingredients, price, title, type, weight } =
      createDishData;
    const dish = await this.prismaService.dish.create({
      data: {
        description,
        ingredients,
        price,
        title,
        type,
        weight,
      },
    });
    return new DishCreateResponceDTO(dish);
  }
}
