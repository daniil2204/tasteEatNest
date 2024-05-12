import { Body, Controller, Post, Query } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { IReservation } from 'types/reservation';
import { User } from 'src/user/decorators/user.decorator';
import { UserInterceptorType } from 'types/user';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @Get()
  async getReservationByDateAndCountOfQuests(
    @Query('date') date: string,
    @Query('count') count: number,
  ) {
    console.log(date);
    console.log(count);
    return this.reservationService.getReservationByDateAndCount(count, date);
  }
  @Post('create')
  async createReservation(
    @User() user: UserInterceptorType,
    @Body() createReservation: IReservation,
  ) {
    const userId = user.id;
    return this.reservationService.createReservationTable(
      userId,
      createReservation,
    );
  }
}
