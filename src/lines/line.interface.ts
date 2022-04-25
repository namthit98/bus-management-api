import { Document } from 'mongoose';

export interface Line extends Document {
  readonly startTime: Date;
  readonly route: string;
  readonly coach: string;
  tickets: any;
}
