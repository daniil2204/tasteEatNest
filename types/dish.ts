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

export interface updateDishInterface {
  title?: string;
  description?: string;
  type?: DishType;
  price?: number;
  weight?: number;
  ingredients?: string[];
}

export interface getDishesInterface {
  offset: number;
  orderByQuery: orderByType;
  take?: number;
  type?: DishType;
  discount?: boolean;
}

export interface orderByType {
  discount?: 'desc';
  likes?: 'desc';
}
