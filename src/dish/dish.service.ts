import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  createDishInterface,
  imageType,
  updateDishInterface,
} from 'types/dish';
import { DishCreateResponceDTO, DishByTypeResponceDTO } from './dto/dish.dto';
import { ImagesService } from 'src/images/images.service';
import { getDishesInterface } from 'types/dish';
import { ValidsImg } from 'types/images';

@Injectable()
export class DishService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imagesService: ImagesService,
  ) {}
  async getDishes({
    offset,
    orderByQuery,
    take,
    type,
    discount,
  }: getDishesInterface) {
    const dishes = await this.prismaService.dish.findMany({
      where: {
        type: type,
      },
      skip: offset,
      take: take,
      orderBy: orderByQuery,
      select: {
        id: true,
        description: true,
        ingredients: true,
        discount: true,
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
        ...(type || discount
          ? {
              image: this.makeValidLink(dish.images[0].url),
            }
          : {
              images: dish.images.map((img) => ({
                url: this.makeValidLink(img.url),
              })),
            }),
      };
      return type || discount
        ? new DishByTypeResponceDTO(fetchDish)
        : new DishCreateResponceDTO(fetchDish);
    });
  }
  async getDishById(id: number) {
    const dish = await this.prismaService.dish.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        description: true,
        ingredients: true,
        discount: true,
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
    dish.images = dish.images.map((img) => {
      img.url = this.makeValidLink(img.url);
      return img;
    });
    return new DishCreateResponceDTO(dish);
  }
  async createDish(createDishData: createDishInterface) {
    const { description, ingredients, price, title, type, weight, images } =
      createDishData;
    const { validsImgs } = await this.imagesIsValidAndExist(images);
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
      this.createImages(validsImgs, dish.id);
      return new DishCreateResponceDTO(dish);
    } catch (err) {
      throw new BadRequestException('Title or Images were used');
    }
  }
  async updateDishById(id: number, updateDishByIdData: updateDishInterface) {
    const dish = await this.prismaService.dish.update({
      where: {
        id,
      },
      data: { ...updateDishByIdData },
    });
    if (updateDishByIdData.price) {
      this.deleteImagesById(dish.id);
    }
    return new DishCreateResponceDTO(dish);
  }
  async deleteDish(id: number) {
    await this.deleteImagesById(id);
    await this.prismaService.dish.delete({
      where: {
        id,
      },
    });
  }
  private async imagesIsValidAndExist(images: imageType[]) {
    const validRes = {
      isValid: true,
      validsImgs: [],
    };
    for (let i = 0; i < images.length; i++) {
      const uploadIndex = images[i].url.indexOf('/uploads');
      if (uploadIndex === -1) {
        throw new BadRequestException('Images are not valid or exists');
      }
      const imgPath = images[i].url.substring(uploadIndex);
      const imgRes = await this.imagesService.checkIsExist(imgPath);
      if (!imgRes.found) {
        throw new BadRequestException('Images are not valid or exists');
      }
      validRes.validsImgs.push({ url: `images${imgPath}` });
    }
    return validRes;
  }
  private async createImages(validsImgs: ValidsImg[], id: number) {
    const dishImages = validsImgs.map((image) => {
      return {
        ...image,
        dishId: id,
      };
    });
    await this.prismaService.image.createMany({
      data: dishImages,
    });
  }
  private async deleteImagesById(id: number) {
    await this.prismaService.image.deleteMany({
      where: {
        dishId: id,
      },
    });
  }
  private makeValidLink(link: string) {
    return `${process.env.DOMAIN}${link}`;
  }
}
