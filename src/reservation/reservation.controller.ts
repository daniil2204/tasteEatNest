import {
  BadRequestException,
  Body,
  Controller,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { User } from 'src/user/decorators/user.decorator';
import { UserInterceptorType } from 'types/user';
import { ReservationCreateRequestDTO } from './dto/reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @Get()
  async getReservationByDateAndCountOfQuests(
    @Query('day', ParseIntPipe) day: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('count') count: number,
  ) {
    const date = { day, month, year };
    console.log(await this.reservationService.isValidDate(date));
    if (await this.reservationService.isValidDate(date)) {
      console.log(date);
      return this.reservationService.getReservationByDateAndCount(count, date);
    } else {
      throw new BadRequestException('The time has an invalid format');
    }
  }
  @Post('create')
  async createReservation(
    @User() user: UserInterceptorType,
    @Body() createReservation: ReservationCreateRequestDTO,
  ) {
    const userId = user.id;
    return this.reservationService.createReservationTable(
      userId,
      createReservation,
    );
  }
}
