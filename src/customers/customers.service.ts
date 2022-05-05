import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from './customers.interface';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Model } from 'mongoose';
import { FindAllCustomerDto } from './dto/find-all-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @Inject('CUSTOMER_MODEL')
    private customerModel: Model<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const existedUser = await this.customerModel.findOne({
      username: createCustomerDto.username,
    });

    if (existedUser) {
      throw new ConflictException('Username is existed.');
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createCustomerDto.password, salt);

    return this.customerModel.create({
      ...createCustomerDto,
      password: hash,
    });
  }

  async findAll(queries: FindAllCustomerDto) {
    const query: any = {
      deleted: false,
    };

    if (queries.searchText) {
      query['$or'] = [
        {
          username: {
            $regex: new RegExp(queries.searchText),
            $options: 'i',
          },
        },
        {
          fullname: {
            $regex: new RegExp(queries.searchText),
            $options: 'i',
          },
        },
        {
          phone: { $regex: new RegExp(queries.searchText), $options: 'i' },
        },
      ];
    }

    const customers = await this.customerModel.find(query).sort('-createdAt');

    return customers;
  }

  async findOne(id: string) {
    const customer = await this.customerModel.findOne({
      _id: id,
      deleted: false,
      role: { $ne: 'admin' },
    });

    if (!customer) {
      throw new NotFoundException('Customer is not found.');
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id);

    const { password, ...customerInfo } = updateCustomerDto;

    const savedData: any = {
      ...customerInfo,
    };

    if (password) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      savedData.password = hash;
    }

    await this.customerModel.updateOne({ _id: customer._id }, savedData);

    return true;
  }

  async remove(id: string) {
    const customer = await this.findOne(id);

    await this.customerModel.updateOne(
      { _id: customer._id },
      { deleted: true },
    );

    return true;
  }
}
