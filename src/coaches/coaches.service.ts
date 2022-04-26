import { Model } from 'mongoose';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { Coach } from './coaches.interface';
import { User } from 'src/users/users.interface';
import { Route } from 'src/routes/routes.interface';
import { FindAllCoachDto } from './dto/find-all-coach.dto';

@Injectable()
export class CoachesService {
  constructor(
    @Inject('COACH_MODEL')
    private coachModel: Model<Coach>,
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    @Inject('ROUTE_MODEL')
    private routeModel: Model<Route>,
  ) {}

  create(createCoachDto: CreateCoachDto) {
    return this.coachModel.create(createCoachDto);
  }

  async findAll(queries: FindAllCoachDto) {
    const query: any = {
      deleted: false,
    };

    if (queries.searchText) {
      query['$or'] = [
        {
          name: {
            $regex: new RegExp(queries.searchText),
            $options: 'i',
          },
        },
        {
          licensePlates: {
            $regex: new RegExp(queries.searchText),
            $options: 'i',
          },
        },
        {
          type: {
            $regex: new RegExp(queries.searchText),
            $options: 'i',
          },
        },
      ];
    }

    const coaches = await this.coachModel
      .find(query)
      .populate('driver')
      .sort('-createdAt');

    return coaches;
  }

  async getCreation() {
    const coaches = await this.coachModel.find().select('driver');
    const driverIds = coaches.map((x) => x.driver);

    const [users] = await Promise.all([
      this.userModel
        .find({
          _id: { $nin: driverIds },
          role: 'driver',
        })
        .select('fullname _id'),
      // this.routeModel.find().select('startingPoint destination _id'),
    ]);

    return { users };
  }

  async findOne(id: string) {
    const coach = await this.coachModel
      .findOne({
        _id: id,
        deleted: false,
      })
      .populate('driver');

    if (!coach) {
      throw new NotFoundException('Coach is not found.');
    }

    return coach;
  }

  async update(id: string, updateCoachDto: UpdateCoachDto) {
    const coach = await this.findOne(id);

    await this.coachModel.updateOne({ _id: coach._id }, updateCoachDto);

    return true;
  }

  async remove(id: string) {
    const coach = await this.findOne(id);

    await this.coachModel.updateOne({ _id: coach._id }, { deleted: true });

    return true;
  }
}
