import * as bcrypt from 'bcrypt';
import { uniq } from 'lodash';
import { startOfDay, endOfDay, add } from 'date-fns';
import { Model } from 'mongoose';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Coach } from 'src/coaches/coaches.interface';
import { Line } from 'src/lines/line.interface';
import { Route } from 'src/routes/routes.interface';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from 'src/tickets/ticket.interface';
import { Customer } from 'src/customers/customers.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.interface';
import { ChangeCustomerPasswordDto } from './dto/change-customer-password.dto';
import { UpdateCustomerInformationDto } from './dto/update-customer-information';

@Injectable()
export class ClientsService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('LINE_MODEL')
    private lineModel: Model<Line>,
    @Inject('COACH_MODEL')
    private coachModel: Model<Coach>,
    @Inject('ROUTE_MODEL')
    private routeModel: Model<Route>,
    @Inject('TICKET_MODEL')
    private ticketModel: Model<Ticket>,
    @Inject('CUSTOMER_MODEL')
    private customerModel: Model<Customer>,
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async getTickets(token: string) {
    const customer = await this.validToken(token);
    if (!customer) {
      throw new UnauthorizedException('Unauthorization');
    }

    return this.ticketModel
      .find({
        customer: customer._id,
      })
      .populate({
        path: 'lineId',
        populate: {
          path: 'route',
          model: 'Route',
        },
      })
      .sort('-createdAt');
  }

  async createTicket(createTicketDto: CreateTicketDto) {
    const line = await this.lineModel
      .findOne({ _id: createTicketDto.lineId })
      .populate('coach');

    if (!createTicketDto.customer) {
      delete createTicketDto.customer;
    }

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

  async register(registerDto: RegisterDto) {
    const existedUser = await this.customerModel.findOne({
      username: registerDto.username,
    });

    if (existedUser) {
      throw new ConflictException('Username is existed.');
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(registerDto.password, salt);

    return this.customerModel.create({
      ...registerDto,
      password: hash,
    });
  }

  async login(loginDto: LoginDto) {
    const existedUser = await this.customerModel.findOne({
      username: loginDto.username,
      deleted: false,
    });

    if (!existedUser) {
      throw new NotFoundException('Username is not found.');
    }

    const isMatch = await bcrypt.compare(
      loginDto.password,
      existedUser.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Password is not right.');
    }

    if (!existedUser.active) {
      throw new UnauthorizedException('Account is locked.');
    }

    const token = this.jwtService.sign(
      {
        user_id: existedUser._id,
      },
      {
        expiresIn: 24 * 60 * 60,
      },
    );

    return {
      token,
      user: existedUser,
    };
  }

  async validToken(token: string) {
    const tokenData = this.jwtService.decode(token) as {
      exp: number;
      iat: number;
      user_id: any;
    };

    const user = await this.customerModel.findOne({
      _id: tokenData?.user_id,
      deleted: false,
    });

    if (!user) {
      throw new NotFoundException('User is not found.');
    }

    return user;
  }

  async cancelTicket(ticketId: string, token: string) {
    const customer = await this.validToken(token);
    if (!customer) {
      throw new UnauthorizedException('Unauthorization');
    }

    const line = await this.lineModel.findOne({
      tickets: ticketId,
    });

    const tickets = await this.ticketModel.find({
      lineId: line._id,
      customer: customer._id,
    });

    const ticketIds = tickets.map((x) => x?._id.toString());

    if (line) {
      line.tickets = line.tickets.filter(
        (x) => !ticketIds.includes(x.toString()),
      );
    }

    return Promise.all([
      line.save(),
      this.ticketModel.deleteMany({ lineId: line._id, customer: customer._id }),
    ]);
  }

  async changePassword(
    changeCustomerPasswordDto: ChangeCustomerPasswordDto,
    token: string,
  ) {
    const customer = await this.validToken(token);
    if (!customer) {
      throw new UnauthorizedException('Unauthorization');
    }

    const isMatch = await bcrypt.compare(
      changeCustomerPasswordDto.password,
      customer.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Old password not match');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(changeCustomerPasswordDto.newpassword, salt);

    await this.customerModel.updateOne(
      { _id: customer._id },
      { password: hash },
    );

    return true;
  }

  async updateCustomerInformation(
    updateCustomerInformationDto: UpdateCustomerInformationDto,
    token: string,
  ) {
    const customer = await this.validToken(token);
    if (!customer) {
      throw new UnauthorizedException('Unauthorization');
    }

    await this.customerModel.updateOne(
      { _id: customer._id },
      updateCustomerInformationDto,
    );

    return this.customerModel.findOne({ _id: customer._id });
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

  async getAllTypeOfCoach() {
    const coaches = await this.coachModel.find();

    const types = coaches.map((x) => x?.type);

    return uniq(types);
  }

  async getLines(queries: any) {
    const query: any = [
      {
        $match: {},
      },
    ];

    query.push(
      ...[
        {
          $lookup: {
            from: 'coaches',
            localField: 'coach',
            foreignField: '_id',
            as: 'coach',
          },
        },
        {
          $unwind: '$coach',
        },
        {
          $lookup: {
            from: 'routes',
            localField: 'route',
            foreignField: '_id',
            as: 'route',
          },
        },
        {
          $unwind: '$route',
        },
      ],
    );

    if (queries.startingPoint && queries.destination && queries.date) {
      console.log(queries.date);
      console.log(new Date(queries.date));
      console.log(startOfDay(add(new Date(queries.date), { hours: 7 })), 1);
      console.log(endOfDay(add(new Date(queries.date), { hours: 7 })), 2);

      query.push({
        $match: {
          startTime: {
            $gte: startOfDay(add(new Date(queries.date), { hours: 7 })),
            $lte: endOfDay(add(new Date(queries.date), { hours: 7 })),
          },
          'route.startingPoint': queries.startingPoint,
          'route.destination': queries.destination,
        },
      });
    }

    if (queries.type) {
      query.push({
        $match: {
          'coach.type': queries.type,
        },
      });
    }

    if (queries.price_sort) {
      if (queries.price_sort === 'asc')
        query.push({ $sort: { 'route.price': 1 } });
      else if (queries.price_sort === 'desc')
        query.push({ $sort: { 'route.price': -1 } });
    }

    const data = await this.lineModel.aggregate(query);

    return data;
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
