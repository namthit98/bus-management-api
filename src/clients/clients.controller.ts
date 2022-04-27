import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ChangeCustomerPasswordDto } from './dto/change-customer-password.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateCustomerInformationDto } from './dto/update-customer-information';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('/tickets')
  getTickets(@Request() req: any) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Unauthorization');
    }

    return this.clientsService.getTickets(req.headers.authorization);
  }

  @Post('/tickets')
  createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.clientsService.createTicket(createTicketDto);
  }

  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.clientsService.register(registerDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.clientsService.login(loginDto);
  }

  @Post('/token/valid')
  validToken(@Body() body: any) {
    return this.clientsService.validToken(body?.token);
  }

  @Patch('/change-password')
  changePassword(
    @Body() changeCustomerPasswordDto: ChangeCustomerPasswordDto,
    @Request() req: any,
  ) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Unauthorization');
    }

    return this.clientsService.changePassword(
      changeCustomerPasswordDto,
      req.headers.authorization,
    );
  }

  @Delete('/tickets/:ticketId/cancel')
  cancelTicket(@Param('ticketId') ticketId, @Request() req: any) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Unauthorization');
    }

    return this.clientsService.cancelTicket(
      ticketId,
      req.headers.authorization,
    );
  }

  @Patch('/customers')
  updateCustomerInformation(
    @Body() updateCustomerInformationDto: UpdateCustomerInformationDto,
    @Request() req: any,
  ) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Unauthorization');
    }

    return this.clientsService.updateCustomerInformation(
      updateCustomerInformationDto,
      req.headers.authorization,
    );
  }

  @Get('/routes')
  getRoutes() {
    return this.clientsService.getRoutes();
  }

  @Get('/lines')
  getLines(@Query() queries: any) {
    return this.clientsService.getLines(queries);
  }

  @Get('/coaches/types')
  getAllTypeOfCoach() {
    return this.clientsService.getAllTypeOfCoach();
  }

  @Get('/starting-points-and-destinations')
  getStartingPointsAndDestinations() {
    return this.clientsService.getStartingPointsAndDestinations();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
