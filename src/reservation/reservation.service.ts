import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DateReservationType, IReservation } from 'types/reservation';
import { ReservationCreateResponceDTO } from './dto/reservation.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prismaService: PrismaService) {}
  async getReservationByDateAndCount(count: number, date: DateReservationType) {
    const reservations = await this.prismaService.reservation.findMany({
      where: {
        day: date.day,
        month: date.month,
        year: date.year,
      },
      select: {
        tableId: true,
      },
    });
    const reservationIds = reservations.map(
      (reservation) => reservation.tableId,
    );
    const tables = await this.prismaService.table.findMany({
      where: {
        countOfQuests: count,
        NOT: {
          id: {
            in: reservationIds,
          },
        },
      },
    });
    return tables;
  }
  async createReservationTable(userId: number, reservationBody: IReservation) {
    const resevationCheck = await this.prismaService.reservation.findFirst({
      where: {
        day: reservationBody.day,
        month: reservationBody.month,
        year: reservationBody.year,
        tableId: reservationBody.tableId,
      },
    });
    if (!resevationCheck) {
      try {
        const table = await this.prismaService.table.findUnique({
          where: {
            id: reservationBody.tableId,
          },
        });
        const reservation = await this.prismaService.reservation.create({
          data: {
            bookHours: reservationBody.bookHours,
            tableId: table.id,
            userId: userId,
            day: reservationBody.day,
            month: reservationBody.month,
            year: reservationBody.year,
          },
        });
        return new ReservationCreateResponceDTO(reservation);
      } catch {
        throw new BadRequestException();
      }
    } else {
      throw new BadRequestException('Reservation is already existed');
    }
  }
  async isValidDate(date: DateReservationType) {
    const todayDate = new Date().getTime();
    const futureDate = new Date().setDate(new Date().getDate() + 14);
    const reservationDate = new Date(
      date.year,
      date.month - 1,
      date.day,
    ).getTime();
    const isValid =
      reservationDate >= todayDate && reservationDate <= futureDate;
    return isValid;
  }
}
