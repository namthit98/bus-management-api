import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
        throw new Error('DB_USER, DB_PASSWORD is required');
      }

      return mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jxtsp.mongodb.net/bus_management?retryWrites=true&w=majority`,
      );
    },
  },
];
