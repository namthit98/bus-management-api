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
import { CoachesService } from './coaches.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { FindAllCoachDto } from './dto/find-all-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';

@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Post()
  @Authorization(true)

  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachesService.create(createCoachDto);
  }

  @Get()
  @Authorization(true)

  findAll(@Query() queries: FindAllCoachDto) {
    return this.coachesService.findAll(queries);
  }

  @Get('/get-creation')
  @Authorization(true)

  getCreation() {
    return this.coachesService.getCreation();
  }

  @Get(':id')
  @Authorization(true)

  findOne(@Param('id') id: string) {
    return this.coachesService.findOne(id);
  }

  @Patch(':id')
  @Authorization(true)

  update(@Param('id') id: string, @Body() updateCoachDto: UpdateCoachDto) {
    return this.coachesService.update(id, updateCoachDto);
  }

  @Delete(':id')
  @Authorization(true)

  remove(@Param('id') id: string) {
    return this.coachesService.remove(id);
  }
}
