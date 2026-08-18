export interface SeatPosition {
  row: string;
  column: number;
}

export interface BulkCreateSeatsData {
  rows: string[];
  columnsPerRow: number;
  premiumSeats?: SeatPosition[];
  reclinerSeats?: SeatPosition[];
}

export interface SeatData {
  screenId: string;
  row: string;
  column: number;
  seatType: 'regular' | 'premium' | 'recliner';
}

export interface Seat {
  id: string;
  screenId: string;
  row: string;
  column: number;
  seatType: 'regular' | 'premium' | 'recliner';
  createdAt: Date;
  updatedAt: Date;
}
