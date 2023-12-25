import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { DishCreateRequetDTO } from './dto/dish.dto';

@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}
  @Get()
  getDishes() {
    return this.dishService.getDishes();
  }
  @Get('/:id')
  getDishById(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.getDishById(id);
  }
  @Post()
  createDish(@Body() createDishData: DishCreateRequetDTO) {
    return this.dishService.createDish(createDishData);
  }
  @Put('/:id')
  updateDishById(@Param('id', ParseIntPipe) id: number) {}
  @Delete('/:id')
  deleteDishById() {
    return null;
  }
}
