import { Document } from 'mongoose';

export interface Ticket extends Document {
  readonly fullname: string;
  readonly phone: string;
  status: string;
  readonly lineId: string;
}
