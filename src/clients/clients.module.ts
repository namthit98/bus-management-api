import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { DatabaseModule } from 'src/database.module';
import { linesProviders } from 'src/lines/lines.providers';
import { coachesProviders } from 'src/coaches/coaches.providers';
import { routesProviders } from 'src/routes/routes.providers';
import { ticketsProviders } from 'src/tickets/tickets.providers';
import { customersProviders } from 'src/customers/customers.providers';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { usersProviders } from 'src/users/users.providers';
import { JwtConfigService } from 'src/config/jwt-config.service';
@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ...usersProviders,
    ...linesProviders,
    ...coachesProviders,
    ...routesProviders,
    ...ticketsProviders,
    ...customersProviders,
  ],
})
export class ClientsModule {}
