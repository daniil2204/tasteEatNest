import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IReservation } from 'types/reservation';

@Injectable()
export class ReservationService {
  constructor(private readonly prismaService: PrismaService) {}
  async getReservationByDateAndCount(count: number, userDate: string) {
    const reservations = await this.prismaService.reservation.findMany({
      where: {
        date: userDate,
      },
      select: {
        tableId: true,
      },
    });
    console.log(reservations);
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
    // const tables = await this.prismaService.table.findMany({
    //   where: {
    //     countOfQuests: count,
    //   },
    //   select: {
    //     countOfQuests: true,
    //     id: true,
    //     Reservation: true,
    //   },
    // });
    // const availableTables = tables.filter(item => );
  }
  async createReservationTable(userId: number, reservationBody: IReservation) {
    console.log(userId);
    console.log(reservationBody);
    const table = await this.prismaService.table.findUnique({
      where: {
        id: reservationBody.tableId,
      },
    });
    console.log(table);
    const reservation = await this.prismaService.reservation.create({
      data: {
        bookHours: reservationBody.bookHours,
        tableId: table.id,
        userId: userId,
        date: reservationBody.date,
      },
    });
    console.log(reservation);
  }
}
