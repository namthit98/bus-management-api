import { Model } from 'mongoose';
import { uniq } from 'lodash';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './routes.interface';
import { FindAllRouteDto } from './dto/find-all-route.dto';

@Injectable()
export class RoutesService {
  constructor(
    @Inject('ROUTE_MODEL')
    private routeModel: Model<Route>,
  ) {}
  create(createRouteDto: CreateRouteDto) {
    return this.routeModel.create(createRouteDto);
  }

  async findAll(queries: FindAllRouteDto) {
    const query: any = {
      deleted: false,
    };

    if (queries.searchText) {
      query['$or'] = [
        {
          startingPoint: {
            $regex: new RegExp(queries.searchText),
            $options: 'i',
          },
        },
        {
          destination: {
            $regex: new RegExp(queries.searchText),
            $options: 'i',
          },
        },
      ];
    }

    const routes = await this.routeModel.find(query).sort('-createdAt');

    return routes;
  }

  async findOne(id: string) {
    const route = await this.routeModel.findOne({
      _id: id,
      deleted: false,
    });

    if (!route) {
      throw new NotFoundException('Route is not found.');
    }

    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    const route = await this.findOne(id);

    await this.routeModel.updateOne({ _id: route._id }, updateRouteDto);

    return true;
  }

  async remove(id: string) {
    const route = await this.findOne(id);

    await this.routeModel.updateOne({ _id: route._id }, { deleted: true });

    return true;
  }

  async getAllStartingPointAndDestination() {
    const routes = await this.routeModel.find();
    const startingPoints = routes.map((x: any) => x.startingPoint);
    const destinations = routes.map((x: any) => x.destination);

    return {
      startingPoints: uniq(startingPoints),
      destinations: uniq(destinations),
    };
  }
}
