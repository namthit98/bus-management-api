import { Connection } from 'mongoose';
import { CustomerSchema } from './schema/customer.schema';

export const customersProviders = [
  {
    provide: 'CUSTOMER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Customer', CustomerSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
