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

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Authorization(true)

  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @Authorization(true)

  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  @Authorization(true)

  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id/status')
  @Authorization(true)

  toggleStatus(@Param('id') id: string) {
    return this.ticketsService.toggleStatus(id);
  }

  @Patch(':id')
  @Authorization(true)

  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @Authorization(true)

  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
