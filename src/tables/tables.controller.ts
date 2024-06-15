import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { ITable } from 'types/table';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}
  @Get()
  async getAllTables(@Query('countOfGuests') countOfGuests?: number) {
    return countOfGuests
      ? this.tablesService.getTablesByCount(countOfGuests)
      : this.tablesService.getTables();
  }
  @Post('create')
  @Roles(UserType.ADMIN)
  async createTable(@Body() table: ITable) {
    return this.tablesService.createTable(table);
  }
  @Put('/:id')
  @Roles(UserType.ADMIN)
  async change(
    @Param('id', ParseIntPipe) tableId: number,
    @Body() table: ITable,
  ) {
    return this.tablesService.updateTable(tableId, table);
  }
}
