import { Connection } from 'mongoose';
import { CoachSchema } from './schemas/coach.schema';

export const coachesProviders = [
  {
    provide: 'COACH_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Coach', CoachSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
