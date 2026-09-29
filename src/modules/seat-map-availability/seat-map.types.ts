export enum SeatAvailabilityStatus {
  AVAILABLE = 'available',
  HELD = 'held',
  BOOKED = 'booked',
}

export type SeatStatus = 'available' | 'held' | 'booked';

export type SeatType = 'regular' | 'premium' | 'recliner';

export type ReservationStatus = 'held' | 'confirmed' | 'cancelled' | 'expired';

export interface GetSeatsParams {
  id: string;
}

export interface SeatWithStatus {
  id: string;             
  row: string;             
  column: number;         
  seatType: SeatType;      
  status: SeatStatus;    
}

export interface SeatWithReservationData {
  id: string;
  row: string;
  column: number;
  seatType: SeatType;
  reservation: {
    status: 'held' | 'confirmed';  
    expiresAt: Date | null;        
  } | null; 
}


export interface Showtime {
  id: string;
  screenId: string;
  startTime: Date;
  endTime: Date;
}
