export interface User {
  id: string;
  username: string;
  displayName: string;
  age: number;
  gender: string;
  created: Date;
  lastActive: Date;
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

export interface RegUser {
  gender: string,
  username: string,
  email: string,
  displayName: string,
  //dateOfBirth: [null,Validators.required],
  city: string,
  country: string,
  password: string,
}

export interface LogUser {
  email: string,
  password: string
}
