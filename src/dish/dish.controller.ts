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
} from '@nestjs/common';
import { DishService } from './dish.service';
import { DishCreateRequestDTO } from './dto/dish.dto';

@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}
  @Get()
  getDishes(@Query('offset') offset?: number) {
    return this.dishService.getDishes(offset ? +offset : 0);
  }
  @Get('/:id')
  getDishById(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.getDishById(id);
  }
  @Post()
  createDish(@Body() createDishData: DishCreateRequestDTO) {
    return this.dishService.createDish(createDishData);
  }
  @Put('/:id')
  updateDishById(@Param('id', ParseIntPipe) id: number) {}
  @Delete('/:id')
  deleteDishById() {
    return null;
  }
}
