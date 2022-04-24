import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
        throw new Error('DB_USER, DB_PASSWORD is required');
      }

      return mongoose.connect(
        `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:27017/bus_management?authSource=admin`,
      );
    },
  },
];
