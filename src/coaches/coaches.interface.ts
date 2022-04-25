import { Document } from 'mongoose';

export interface Coach extends Document {
  readonly name: string;
  readonly licensePlates: string;
  readonly seats: number;
  readonly type: string;
  readonly route: string;
  readonly driver: string;
}
