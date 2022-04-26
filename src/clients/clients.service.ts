import { uniq } from 'lodash';
import { Model } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Coach } from 'src/coaches/coaches.interface';
import { Line } from 'src/lines/line.interface';
import { Route } from 'src/routes/routes.interface';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from 'src/tickets/ticket.interface';

@Injectable()
export class ClientsService {
  constructor(
    @Inject('LINE_MODEL')
    private lineModel: Model<Line>,
    @Inject('COACH_MODEL')
    private coachModel: Model<Coach>,
    @Inject('ROUTE_MODEL')
    private routeModel: Model<Route>,
    @Inject('TICKET_MODEL')
    private ticketModel: Model<Ticket>,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto) {
    const line = await this.lineModel
      .findOne({ _id: createTicketDto.lineId })
      .populate('coach');

    console.log(parseInt(line.coach.seats) - line.tickets.length);
    if (
      parseInt(line.coach.seats) - line.tickets.length <
      createTicketDto.numberOfTickets
    ) {
      throw new ConflictException('Out of seats');
    }

    for (const i of Array.from(Array(createTicketDto.numberOfTickets).keys())) {
      const ticket = await this.ticketModel.create(createTicketDto);
      await this.lineModel.updateOne(
        { _id: createTicketDto.lineId },
        {
          $push: {
            tickets: ticket._id,
          },
        },
      );
    }

    return true;
  }

  findAll() {
    return `This action returns all clients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }

  getRoutes() {
    return this.routeModel.find();
  }

  getLines() {
    return this.lineModel.find();
  }

  async getStartingPointsAndDestinations() {
    const routes = await this.routeModel.find();
    const startingPoints = routes.map((x: any) => x.startingPoint);
    const destinations = routes.map((x: any) => x.destination);

    return {
      startingPoints: uniq(startingPoints),
      destinations: uniq(destinations),
    };
  }
}
