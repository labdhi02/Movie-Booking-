export interface CreateShowtimeData {
  movieId: string;
  screenId: string;
  startTime: Date;
  endTime: Date;
  status?: 'scheduled' | 'ongoing' | 'completed';
}

export interface UpdateShowtimeData {
  movieId?: string;
  screenId?: string;
  startTime?: Date;
  endTime?: Date;
  status?: 'scheduled' | 'ongoing' | 'completed';
}

export interface GetShowtimesQuery {
  movieId?: string;
  theaterId?: string;
  date?: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  screenId: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'ongoing' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
