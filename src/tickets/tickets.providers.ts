import { Connection } from 'mongoose';
import { ticketSchema } from './schema/ticket.schema';

export const ticketsProviders = [
  {
    provide: 'TICKET_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Ticket', ticketSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
