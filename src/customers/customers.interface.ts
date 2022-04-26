import { Document } from 'mongoose';

export interface Customer extends Document {
  readonly username: string;
  readonly password: string;
  readonly fullname: string;
  readonly email: string;
  readonly phone: string;
  readonly birthday: Date;
  readonly identification: string;
  readonly active: boolean;
}
