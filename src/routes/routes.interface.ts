import { Document } from 'mongoose';

export interface Route extends Document {
  readonly from: string;
  readonly to: string;
  readonly price: string;
  readonly timeShift: string;
  readonly distance: string;
}
