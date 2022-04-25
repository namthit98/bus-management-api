import { Model } from 'mongoose';
import {isEmpty} from 'lodash'
import * as moment from 'moment';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { Coach } from 'src/coaches/coaches.interface';
import { Route } from 'src/routes/routes.interface';
import { Line } from './line.interface';
import { FindAllLineDto } from './dto/find-all-line.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class LinesService {
  constructor(
    @Inject('LINE_MODEL')
    private lineModel: Model<Line>,
    @Inject('COACH_MODEL')
    private coachModel: Model<Coach>,
    @Inject('ROUTE_MODEL')
    private routeModel: Model<Route>,
  ) {}

  async create(createLineDto: CreateLineDto) {
    const existedLines = await this.lineModel.find({
      coach: createLineDto.coach,
      $or: [
        {
          startTime: {
            $gte: createLineDto.startTime,
            $lte: createLineDto.endTime,
          },
        },
        {
          endTime: {
            $gte: createLineDto.startTime,
            $lte: createLineDto.endTime,
          },
        },
        {
          startTime: {
            $gte: createLineDto.startTime,
          },
          endTime: {
            $lte: createLineDto.endTime,
          },
        },
        {
          startTime: {
            $lte: createLineDto.startTime,
          },
          endTime: {
            $gte: createLineDto.endTime,
          },
        },
      ],
    });

    console.log(createLineDto);
    console.log(existedLines);

    if (existedLines && existedLines.length) {
      throw new ConflictException('Time is duplicate');
    }

    return this.lineModel.create(createLineDto);
  }

  async createTicket(lineId: string, createTicketDto: CreateTicketDto) {
    return this.lineModel.updateOne(
      { _id: lineId },
      {
        $push: {
          tickets: createTicketDto,
        },
      },
    );
  }

  async toggleTicketStatus(lineId: string, ticketId: string) {
    const line = await this.lineModel.findOne({
      _id: lineId,
    });

    line?.tickets.forEach((ticket) => {
      if (ticket._id.toString() === ticketId) {
        if (ticket.status === 'unpaid') {
          ticket.status = 'paid';
        } else {
          ticket.status = 'unpaid';
        }
      }
    });

    return line.save();
  }

  async removeTicket(lineId: string, ticketId: string) {
    const line = await this.lineModel.findOne({
      _id: lineId,
    });

    line.tickets = line.tickets.filter(
      (ticket) => ticket._id.toString() !== ticketId,
    );

    return line.save();
  }

  async findAll(queries: FindAllLineDto) {
    const query: any = {};

    let routeQuery: any = {}
    if (queries.startingPoint && queries.startingPoint !== 'all') {
      routeQuery.startingPoint = queries.startingPoint
    }

    if (queries.destination && queries.destination !== 'all') {
      routeQuery.destination = queries.destination
    }

    if(!isEmpty(routeQuery)) {
      const routes = await this.routeModel.find(routeQuery)
      const routeIds = routes.map(x => x._id)
      query.route = {
        $in: routeIds
      }
    }

    if (queries.startTime && !queries.endTime) {
      query.startTime = {
        $gte: queries.startTime,
      };
    }

    if (!queries.startTime && queries.endTime) {
      query.endTime = {
        $lte: queries.endTime,
      };
    }

    if (queries.startTime && queries.endTime) {
      query['$or'] = [
        {
          startTime: {
            $gte: queries.startTime,
            $lte: queries.endTime,
          },
        },
        {
          endTime: {
            $gte: queries.startTime,
            $lte: queries.endTime,
          },
        },
      ];
    }

    const lines = await this.lineModel
      .find(query)
      .populate('route coach tickets')
      .sort('startTime')
    return lines;
  }

  async getCreation() {
    const [coaches, routes] = await Promise.all([
      this.coachModel.find().select('name licensePlates _id'),
      this.routeModel.find().select('startingPoint destination timeShift _id'),
    ]);

    return { coaches, routes };
  }

  async findOne(id: string) {
    const line = await this.lineModel
      .findOne({
        _id: id,
        deleted: false,
      })
      .populate('route coach tickets');

    if (!line) {
      throw new NotFoundException('Line is not found.');
    }

    return line;
  }

  async update(id: string, updateLineDto: UpdateLineDto) {
    const line = await this.findOne(id);

    await this.lineModel.updateOne({ _id: line._id }, updateLineDto);

    return true;
  }

  remove(id: string) {
    return this.lineModel.deleteOne({ _id: id });
  }
}
