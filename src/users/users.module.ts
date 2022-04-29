import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { DatabaseModule } from 'src/database.module';
import { coachesProviders } from 'src/coaches/coaches.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders, ...coachesProviders],
  exports: [UsersService],
})
export class UsersModule {}
