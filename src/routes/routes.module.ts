import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { DatabaseModule } from 'src/database.module';
import { routesProviders } from './routes.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RoutesController],
  providers: [RoutesService, ...routesProviders],
})
export class RoutesModule {}
