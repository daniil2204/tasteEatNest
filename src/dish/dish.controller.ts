import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  Query,
  ParseEnumPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { DishCreateRequestDTO, DishUpdateRequestDTO } from './dto/dish.dto';
import { DishType, UserType } from '@prisma/client';
import { orderByType } from 'types/dish';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}
  @Get()
  getDishes(
    @Query('offset') offset?: number,
    @Query('likes', new ParseBoolPipe({ optional: true })) likes?: boolean,
    @Query('discount', new ParseBoolPipe({ optional: true }))
    discount?: boolean,
    @Query('type', new ParseEnumPipe(DishType, { optional: true }))
    type?: DishType,
  ) {
    const orderByQuery: orderByType = {
      ...(likes && { likes: 'desc' }),
      ...(discount && !likes && { discount: 'desc' }),
    };
    const take = discount ? 2 : 4;
    return this.dishService.getDishes({
      offset: +offset || 0,
      orderByQuery,
      take: !type ? take : undefined,
      type,
      discount,
    });
  }
  @Get('/:id')
  getDishById(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.getDishById(id);
  }
  @Roles(UserType.ADMIN)
  @Post()
  createDish(@Body() createDishData: DishCreateRequestDTO) {
    return this.dishService.createDish(createDishData);
  }
  @Roles(UserType.ADMIN)
  @Put('/:id')
  updateDishById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDishByIdData: DishUpdateRequestDTO,
  ) {
    return this.dishService.updateDishById(id, updateDishByIdData);
  }
  @Roles(UserType.ADMIN)
  @Delete('/:id')
  deleteDishById(@Param('id', ParseIntPipe) id: number) {
    this.dishService.deleteDish(id);
  }
}
