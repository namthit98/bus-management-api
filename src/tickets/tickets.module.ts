import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { DatabaseModule } from 'src/database.module';
import { ticketsProviders } from './tickets.providers';
import { linesProviders } from 'src/lines/lines.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [TicketsController],
  providers: [TicketsService, ...ticketsProviders, ...linesProviders],
})
export class TicketsModule {}
