import { DishType } from '@prisma/client';

export interface createDishInterface {
  title: string;
  description: string;
  type: DishType;
  price: number;
  weight: number;
  ingredients: string[];
}
