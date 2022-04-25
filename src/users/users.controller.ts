import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Authorization } from 'src/decorators/authorization.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from './users.interface';
import { ChangePasswordDto } from './dto/change-user-password.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Authorization(true)

  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Authorization(true)

  findAll(@Query() queries: FindAllUserDto) {
    return this.usersService.findAll(queries);
  }

  @Get(':id')
  @Authorization(true)

  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Authorization(true)

  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Authorization(true)

  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch('/password/change')
  @Authorization(true)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: User,
  ) {
    await this.usersService.changePassword(user, changePasswordDto);

    return {
      data: null,
      statusCode: HttpStatus.OK,
      message: 'Change password successfully',
      error: null,
    };
  }
}
