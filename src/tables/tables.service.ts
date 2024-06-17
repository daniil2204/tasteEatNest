import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ITable } from 'types/table';

@Injectable()
export class TablesService {
  constructor(private readonly prismaService: PrismaService) {}
  async getTables() {
    const tables = await this.prismaService.table.findMany();
    return tables;
  }
  async getTablesByCount(countOfGuests: number) {
    const tables = await this.prismaService.table.findMany({
      where: {
        countOfGuests: countOfGuests,
      },
    });
    return tables;
  }
  async createTable(tableData: ITable) {
    const table = await this.prismaService.table.create({
      data: {
        countOfGuests: tableData.countOfGuests,
      },
    });
    return table;
  }
  async updateTable(tableId: number, tableData: ITable) {
    const table = await this.prismaService.table.update({
      where: {
        id: tableId,
      },
      data: {
        countOfGuests: tableData.countOfGuests,
      },
    });
    return table;
  }
}
