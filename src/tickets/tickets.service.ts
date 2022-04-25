import { Model } from 'mongoose';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './ticket.interface';
import { Line } from 'src/lines/line.interface';

@Injectable()
export class TicketsService {
  constructor(
    @Inject('TICKET_MODEL')
    private ticketModel: Model<Ticket>,
    @Inject('LINE_MODEL')
    private lineModel: Model<Line>,
  ) {}
  async create(createTicketDto: CreateTicketDto) {
    const ticket = await this.ticketModel.create(createTicketDto);

    await this.lineModel.updateOne(
      { _id: createTicketDto.lineId },
      {
        $push: {
          tickets: ticket._id,
        },
      },
    );

    return ticket;
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: string, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  async toggleStatus(id: string) {
    const ticket = await this.ticketModel.findOne({ _id: id });
    if (!ticket) {
      throw new NotFoundException('Ticket is not found.');
    }
    ticket.status = ticket.status === 'unpaid' ? 'paid' : 'unpaid';
    return ticket.save();
  }

  remove(id: string) {
    return this.ticketModel.deleteOne({ _id: id });
  }
}
