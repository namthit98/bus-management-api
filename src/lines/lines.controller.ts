import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LinesService } from './lines.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { FindAllLineDto } from './dto/find-all-line.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Authorization } from 'src/decorators/authorization.decorator';

@Controller('lines')
export class LinesController {
  constructor(private readonly linesService: LinesService) {}

  @Post()
  @Authorization(true)
  create(@Body() createLineDto: CreateLineDto) {
    return this.linesService.create(createLineDto);
  }

  @Post('/:lineId/tickets')
  @Authorization(true)
  addTicket(
    @Param('lineId') lineId: string,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    return this.linesService.createTicket(lineId, createTicketDto);
  }

  @Patch('/:lineId/tickets/:ticketId/status')
  @Authorization(true)
  toggleTicketStatus(
    @Param('lineId') lineId: string,
    @Param('ticketId') ticketId: string,
  ) {
    return this.linesService.toggleTicketStatus(lineId, ticketId);
  }

  @Delete('/:lineId/tickets/:ticketId')
  @Authorization(true)
  removeTicket(
    @Param('lineId') lineId: string,
    @Param('ticketId') ticketId: string,
  ) {
    return this.linesService.removeTicket(lineId, ticketId);
  }

  @Get()
  @Authorization(true)
  findAll(@Query() queries: FindAllLineDto) {
    return this.linesService.findAll(queries);
  }

  @Get('/get-creation')
  @Authorization(true)
  getCreation() {
    return this.linesService.getCreation();
  }

  @Get(':id')
  @Authorization(true)
  findOne(@Param('id') id: string) {
    return this.linesService.findOne(id);
  }

  @Patch(':id')
  @Authorization(true)
  update(@Param('id') id: string, @Body() updateLineDto: UpdateLineDto) {
    return this.linesService.update(id, updateLineDto);
  }

  @Delete(':id')
  @Authorization(true)
  remove(@Param('id') id: string) {
    return this.linesService.remove(id);
  }
}
