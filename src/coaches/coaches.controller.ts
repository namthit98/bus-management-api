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
import { Authorization } from 'src/decorators/authorization.decorator';
import { Permission } from 'src/decorators/permission.decorator';
import { CoachesService } from './coaches.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { FindAllCoachDto } from './dto/find-all-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';

@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Post()
  @Authorization(true)
  @Permission(['admin', 'staff'])
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachesService.create(createCoachDto);
  }

  @Get()
  @Authorization(true)
  @Permission(['admin', 'staff'])
  findAll(@Query() queries: FindAllCoachDto) {
    return this.coachesService.findAll(queries);
  }

  @Get('/get-creation')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  getCreation() {
    return this.coachesService.getCreation();
  }

  @Get(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  findOne(@Param('id') id: string) {
    return this.coachesService.findOne(id);
  }

  @Patch(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  update(@Param('id') id: string, @Body() updateCoachDto: UpdateCoachDto) {
    return this.coachesService.update(id, updateCoachDto);
  }

  @Delete(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  remove(@Param('id') id: string) {
    return this.coachesService.remove(id);
  }
}
