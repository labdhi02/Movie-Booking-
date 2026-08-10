export interface CreateTheaterData {
  name: string;
  location: string;
  address: string;
}

export interface UpdateTheaterData {
  name?: string;
  location?: string;
  address?: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
