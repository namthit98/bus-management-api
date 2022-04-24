import { Connection } from 'mongoose';
import { RouteSchema } from './schemas/route.schema';

export const routesProviders = [
  {
    provide: 'ROUTE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Route', RouteSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
