export interface User {
  id: string;
  username: string;
  displayName: string;
  age: number;
  gender: string;
  created: Date;
  lastActive: Date;
  dateOfBirth: Date;
  photoUrl: string;
  city: string;
  country: string;
  interests?: string;
  introduction?: string;
  lookingFor?: string;
  photos?: Photo[];
}

export interface Photo {
  id: string;
  url: string;
  description: string;
  added: Date;
  isMain: boolean;
  status: boolean;
}

export interface RequestQueryUserParams {
  gender?: string
  page?: number
  itemsPerPage?: number
  minAge?: number
  maxAge?: number
  orderBy?: string
}

export interface LogUser {
  email: string,
  password: string
}
