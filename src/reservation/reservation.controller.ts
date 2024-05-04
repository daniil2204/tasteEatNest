import { Controller, Query } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @Get()
  async getReservationByDateAndCountOfQuests(
    @Query('date') date: string,
    @Query('count') count: number,
  ) {
    return this.reservationService.getReservationByDateAndCount();
  }
}
