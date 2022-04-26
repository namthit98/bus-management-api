import * as bcrypt from 'bcrypt';
import { uniq } from 'lodash';
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

  async createTicket(createTicketDto: CreateTicketDto) {
    const line = await this.lineModel
      .findOne({ _id: createTicketDto.lineId })
      .populate('coach');

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
