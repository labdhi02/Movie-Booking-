export interface CreateScreenData {
  theaterId: string;
  name: string;
  screenNumber: number;
  totalSeats: number;
}

export interface UpdateScreenData {
  name?: string;
  screenNumber?: number;
  totalSeats?: number;
}

export interface Screen {
  id: string;
  theaterId: string;
  name: string;
  screenNumber: number;
  totalSeats: number;
  createdAt: Date;
  updatedAt: Date;
}
