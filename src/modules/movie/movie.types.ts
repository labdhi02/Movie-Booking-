export interface CreateMovieData {
  title: string;
  durationMinutes: number;
  genres?: string[];
  actors?: string[];
  rating?: string;
  description?: string;
  releaseDate?: string;
}

export interface UpdateMovieData {
  title?: string;
  durationMinutes?: number;
  genres?: string[];
  actors?: string[];
  rating?: string;
  description?: string;
  releaseDate?: string;
}

export interface Movie {
  id: string;
  title: string;
  genres: string[] | null;
  actors: string[] | null;
  durationMinutes: number;
  rating: string | null;
  description: string | null;
  releaseDate: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
