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
  like?: string
  photos?: Photo[];
}

export interface Message {
  id: string
  senderId: string
  senderDisplayName: string
  senderPhotoUrl: string
  recipientId: string
  recipientDisplayName: string
  recipientPhotoUrl: string
  content: string
  isRead: boolean
  dateRead: Date
  messageSent: Date
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
  like?: string
}

export interface LogUser {
  email: string,
  password: string
}
