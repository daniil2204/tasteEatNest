import { DishType } from '@prisma/client';

export type imageType = {
  url: string;
};

export interface createDishInterface {
  title: string;
  description: string;
  type: DishType;
  price: number;
  weight: number;
  ingredients: string[];
  images: imageType[];
}
