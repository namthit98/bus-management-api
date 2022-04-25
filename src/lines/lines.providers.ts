import { Connection } from 'mongoose';
import { LineSchema } from './schemas/line.schema';

export const linesProviders = [
  {
    provide: 'LINE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Line', LineSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
