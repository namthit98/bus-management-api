import { Module } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CoachesController } from './coaches.controller';
import { DatabaseModule } from 'src/database.module';
import { coachesProviders } from './coaches.providers';
import { usersProviders } from 'src/users/users.providers';
import { routesProviders } from 'src/routes/routes.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CoachesController],
  providers: [
    CoachesService,
    ...coachesProviders,
    ...usersProviders,
    ...routesProviders,
  ],
})
export class CoachesModule {}
