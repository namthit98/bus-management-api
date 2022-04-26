import { Document } from 'mongoose';

export interface Line extends Document {
  readonly startTime: Date;
  readonly route: any;
  readonly coach: any;
  tickets: any;
}
