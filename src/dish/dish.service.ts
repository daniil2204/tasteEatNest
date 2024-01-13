import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createDishInterface, imageType } from 'types/dish';
import { DishCreateResponceDTO } from './dto/dish.dto';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class DishService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imagesService: ImagesService,
  ) {}
  async getDishes(offset: number) {
    const dishes = await this.prismaService.dish.findMany({
      skip: offset,
      take: 4,
      select: {
        id: true,
        description: true,
        ingredients: true,
        price: true,
        title: true,
        type: true,
        weight: true,
        images: {
          select: {
            url: true,
          },
        },
      },
    });
    return dishes.map((dish) => {
      const fetchDish = {
        ...dish,
        images: dish.images.map((img) => ({
          url: `${process.env.DOMAIN}${img.url}`,
        })),
      };
      return new DishCreateResponceDTO(fetchDish);
    });
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
    const { description, ingredients, price, title, type, weight, images } =
      createDishData;
    const { isValid, validsImgs } = await this.imagesIsValidAndExist(images);
    if (!isValid) {
      return {
        status: 400,
        message: 'Images are not valid or exists',
      };
    }
    try {
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
      const dishImages = validsImgs.map((image) => {
        return {
          ...image,
          dishId: dish.id,
        };
      });
      console.log(dishImages);
      await this.prismaService.image.createMany({
        data: dishImages,
      });
      return new DishCreateResponceDTO(dish);
    } catch (err) {
      return {
        status: 400,
        message: 'Title or Images were used',
      };
    }
  }
  private async imagesIsValidAndExist(images: imageType[]) {
    const validRes = {
      isValid: true,
      validsImgs: [],
    };
    for (let i = 0; i < images.length; i++) {
      const uploadIndex = images[i].url.indexOf('/uploads');
      if (uploadIndex === -1) {
        validRes.isValid = false;
        break;
      }
      const imgPath = images[i].url.substring(uploadIndex);
      const imgRes = await this.imagesService.checkIsExist(imgPath);
      if (!imgRes.found) {
        validRes.isValid = false;
        break;
      }
      validRes.validsImgs.push({ url: `images${imgPath}` });
    }
    console.log(validRes.validsImgs);
    return validRes;
  }
}
