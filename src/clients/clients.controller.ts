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
