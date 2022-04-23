import { Document } from 'mongoose';

export interface User extends Document {
  readonly username: string;
  readonly password: string;
  readonly fullname: string;
  readonly email: string;
  readonly phone: string;
  readonly birthday: Date;
  readonly identification: string;
  readonly role: string;
  readonly active: boolean;
}
