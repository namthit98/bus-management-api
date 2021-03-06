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
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { FindAllRouteDto } from './dto/find-all-route.dto';
import { Authorization } from 'src/decorators/authorization.decorator';
import { Permission } from 'src/decorators/permission.decorator';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @Authorization(true)
  @Permission(['admin', 'staff'])
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  @Authorization(true)
  @Permission(['admin', 'staff'])
  findAll(@Query() queries: FindAllRouteDto) {
    return this.routesService.findAll(queries);
  }

  @Get('/starting-point-and-destinations')
  @Authorization(true)
  @Permission(['admin', 'staff', 'driver'])
  getAllStartingPointAndDestination() {
    return this.routesService.getAllStartingPointAndDestination();
  }

  @Get(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Patch(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(id, updateRouteDto);
  }

  @Delete(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }
}
