export interface IReservation {
  tableId: number;
  bookHour: number;
  day: number;
  year: number;
  month: number;
  hourCount: number;
}

export type DateReservationType = Omit<
  IReservation,
  'tableId' | 'bookHour' | 'hourCount'
>;
