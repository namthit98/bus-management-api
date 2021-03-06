import { Module } from '@nestjs/common';
import { LinesService } from './lines.service';
import { LinesController } from './lines.controller';
import { DatabaseModule } from 'src/database.module';
import { routesProviders } from 'src/routes/routes.providers';
import { coachesProviders } from 'src/coaches/coaches.providers';
import { linesProviders } from './lines.providers';
import { ticketsProviders } from 'src/tickets/tickets.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [LinesController],
  providers: [
    LinesService,
    ...routesProviders,
    ...coachesProviders,
    ...linesProviders,
    ...ticketsProviders,
  ],
})
export class LinesModule {}
