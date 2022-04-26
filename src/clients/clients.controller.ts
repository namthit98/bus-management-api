import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

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

  @Get('/routes')
  getRoutes() {
    return this.clientsService.getRoutes();
  }

  @Get('/lines')
  getLines() {
    return this.clientsService.getLines().populate('route coach');
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
