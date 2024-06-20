import {
  BadRequestException,
  Body,
  Controller,
  Param,
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
    if (await this.reservationService.isValidDate(date)) {
      return this.reservationService.getReservationByDateAndCount(count, date);
    } else {
      throw new BadRequestException('The time has an invalid format');
    }
  }
  @Post('/create')
  async createReservation(
    @User() user: UserInterceptorType,
    @Body() createReservation: ReservationCreateRequestDTO,
  ) {
    const userId = user.id;
    if (
      (await this.reservationService.isValidDate({
        day: createReservation.day,
        month: createReservation.month,
        year: createReservation.year,
      })) &&
      userId
    ) {
      return this.reservationService.createReservationTable(
        userId,
        createReservation,
      );
    } else {
      throw new BadRequestException('The time has an invalid format');
    }
  }
  @Get('/userReservations')
  async getUserReservation(@User() user: UserInterceptorType) {
    const userId = user.id;
    if (userId) {
      return this.reservationService.getUserReservation(userId);
    } else {
      throw new BadRequestException('The invalid request');
    }
  }
  @Get('/:reservationId')
  async getReservationById(
    @User() user: UserInterceptorType,
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    const userId = user.id;
    if (userId && reservationId) {
      return this.reservationService.getReservationById(userId, reservationId);
    } else {
      throw new BadRequestException('Reservation is not founded');
    }
  }
}
