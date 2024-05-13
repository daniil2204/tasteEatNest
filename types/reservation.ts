export interface IReservation {
  tableId: number;
  bookHours: number;
  day: number;
  year: number;
  month: number;
}

export type DateReservationType = Omit<IReservation, 'tableId' | 'bookHours'>;
