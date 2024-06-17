export interface ITable {
  countOfGuests: number;
}

export type getTable = {
  id: number;
  countOfGuests: number;
};

export type tableAndFreeTime = {
  table: getTable;
  freeHours: number[];
};
