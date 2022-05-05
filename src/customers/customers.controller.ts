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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { FindAllCustomerDto } from './dto/find-all-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Authorization(true)
  @Permission(['admin', 'staff'])
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @Authorization(true)
  @Permission(['admin', 'staff'])
  findAll(@Query() queries: FindAllCustomerDto) {
    return this.customersService.findAll(queries);
  }

  @Get(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Authorization(true)
  @Permission(['admin', 'staff'])
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
