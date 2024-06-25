import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DateReservationType, IReservation } from 'types/reservation';
import { ReservationCreateResponceDTO } from './dto/reservation.dto';
import { tableAndFreeTime } from 'types/table';
import { workHours } from 'src/utils/additionalInfo';

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
        bookHour: true,
        hourCount: true,
      },
    });
    const tables = await this.prismaService.table.findMany({
      where: {
        countOfGuests: count,
      },
    });
    const tablesAndFreeTime: tableAndFreeTime[] = tables.reduce((acc, item) => {
      const tableAndFTime = { table: item, freeHours: [] };
      const reservedTable = reservations.find(
        (reservation) => reservation.tableId === item.id,
      );
      if (reservedTable) {
        tableAndFTime.freeHours = this.getFreeBookHours({
          bookHour: reservedTable.bookHour,
          hourCount: reservedTable.hourCount,
        });
      } else {
        tableAndFTime.freeHours = workHours;
      }
      acc.push(tableAndFTime);
      return acc;
    }, []);
    return tablesAndFreeTime;
  }
  async createReservationTable(userId: number, reservationBody: IReservation) {
    const resevationCheck = await this.prismaService.reservation.findFirst({
      where: {
        day: reservationBody.day,
        month: reservationBody.month,
        year: reservationBody.year,
        bookHour: reservationBody.bookHour,
        hourCount: reservationBody.hourCount,
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
            bookHour: reservationBody.bookHour,
            hourCount: reservationBody.hourCount,
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
  getFreeBookHours({
    bookHour,
    hourCount,
  }: {
    bookHour: number;
    hourCount: number;
  }) {
    const bookedHours = [];
    for (let i = 0; i < hourCount; i++) {
      bookedHours.push(bookHour + i);
    }
    return workHours.filter((item) => !bookedHours.includes(item));
  }
  async getReservationById(userId: number, reservationId: number) {
    const reservation = await this.prismaService.reservation.findUnique({
      where: {
        userId: userId,
        id: reservationId,
      },
    });
    if (reservation) {
      return reservation;
    } else {
      throw new BadRequestException('Reservation is not founded');
    }
  }
  async getUserReservation(userId: number) {
    const reservations = this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        reservation: true,
      },
    });
    return reservations;
  }
}
