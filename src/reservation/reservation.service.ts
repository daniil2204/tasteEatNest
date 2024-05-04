import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
  async createReservationTable() {}
}
