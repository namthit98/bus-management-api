import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/authorization.guard';
import { PermissionGuard } from './guards/permission.guard';
import { RoutesModule } from './routes/routes.module';
import { CoachesModule } from './coaches/coaches.module';
import { LinesModule } from './lines/lines.module';
import { TicketsModule } from './tickets/tickets.module';
import { ClientsModule } from './clients/clients.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'build'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    UsersModule,
    AuthModule,
    RoutesModule,
    CoachesModule,
    LinesModule,
    TicketsModule,
    ClientsModule,
    CustomersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
