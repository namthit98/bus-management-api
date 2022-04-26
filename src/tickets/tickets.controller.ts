import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Authorization } from 'src/decorators/authorization.decorator';
import { Permission } from 'src/decorators/permission.decorator';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Authorization(true)
  @Permission(['admin', 'staff'])
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @Authorization(true)
  @Permission(['admin', 'staff'])
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id/status')
  @Authorization(true)
  @Permission(['admin', 'staff', 'driver'])
  toggleStatus(@Param('id') id: string) {
    return this.ticketsService.toggleStatus(id);
  }

  @Patch(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
