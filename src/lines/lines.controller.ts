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
import { Permission } from 'src/decorators/permission.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/users.interface';

@Controller('lines')
export class LinesController {
  constructor(private readonly linesService: LinesService) {}

  @Post()
  @Authorization(true)
  @Permission(['admin', 'staff'])
  create(@Body() createLineDto: CreateLineDto) {
    return this.linesService.create(createLineDto);
  }

  @Post('/:lineId/tickets')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  addTicket(
    @Param('lineId') lineId: string,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    return this.linesService.createTicket(lineId, createTicketDto);
  }

  @Patch('/:lineId/tickets/:ticketId/status')
  @Authorization(true)
  @Permission(['admin', 'staff', 'driver'])
  toggleTicketStatus(
    @Param('lineId') lineId: string,
    @Param('ticketId') ticketId: string,
  ) {
    return this.linesService.toggleTicketStatus(lineId, ticketId);
  }

  @Delete('/:lineId/tickets/:ticketId')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  removeTicket(
    @Param('lineId') lineId: string,
    @Param('ticketId') ticketId: string,
  ) {
    return this.linesService.removeTicket(lineId, ticketId);
  }

  @Get()
  @Authorization(true)
  @Permission(['admin', 'staff', 'driver'])
  findAll(@CurrentUser() user: User,  @Query() queries: FindAllLineDto) {
    return this.linesService.findAll(queries, user);
  }

  @Get('/get-creation')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  getCreation() {
    return this.linesService.getCreation();
  }

  @Get(':id')
  @Authorization(true)
  @Permission(['admin', 'staff', 'driver'])
  findOne(@Param('id') id: string) {
    return this.linesService.findOne(id);
  }

  @Patch(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  update(@Param('id') id: string, @Body() updateLineDto: UpdateLineDto) {
    return this.linesService.update(id, updateLineDto);
  }

  @Delete(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  remove(@Param('id') id: string) {
    return this.linesService.remove(id);
  }
}
