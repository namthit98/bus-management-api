import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { DatabaseModule } from 'src/database.module';
import { linesProviders } from 'src/lines/lines.providers';
import { coachesProviders } from 'src/coaches/coaches.providers';
import { routesProviders } from 'src/routes/routes.providers';
import { ticketsProviders } from 'src/tickets/tickets.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ...linesProviders,
    ...coachesProviders,
    ...routesProviders,
    ...ticketsProviders,
  ],
})
export class ClientsModule {}
