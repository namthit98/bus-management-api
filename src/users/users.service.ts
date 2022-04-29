import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.interface';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { Coach } from 'src/coaches/coaches.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    @Inject('COACH_MODEL')
    private coachModel: Model<Coach>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existedUser = await this.userModel.findOne({
      username: createUserDto.username,
    });

    if (existedUser) {
      throw new ConflictException('Username is existed.');
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);

    return this.userModel.create({
      ...createUserDto,
      password: hash,
    });
  }

  async findAll(queries: FindAllUserDto) {
    const query: any = {
      deleted: false,
      role: { $ne: 'admin' },
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

    if (queries.role && queries.role !== 'all') {
      query.role = { $eq: queries.role };
    }

    const users = await this.userModel.find(query).sort('-createdAt');

    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({
      _id: id,
      deleted: false,
      role: { $ne: 'admin' },
    });

    if (!user) {
      throw new NotFoundException('User is not found.');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const { password, ...userInfo } = updateUserDto;

    const savedData: any = {
      ...userInfo,
    };

    if (password) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      savedData.password = hash;
    }

    await this.userModel.updateOne({ _id: user._id }, savedData);

    return true;
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    const coach = await this.coachModel.findOne({ driver: user._id });

    if (coach) {
      throw new ConflictException('This user is belong to one coach');
    }

    await this.userModel.updateOne({ _id: user._id }, { deleted: true });

    return true;
  }

  async me(id: string) {
    const user = await this.userModel.findOne({
      _id: id,
      deleted: false,
    });

    if (!user) {
      throw new NotFoundException('User is not found.');
    }

    return user;
  }

  async changePassword(currentUser: User, { password, newpassword }) {
    const user = await this.userModel.findOne({
      _id: currentUser?._id,
      deleted: false,
    });

    if (!user) {
      throw new NotFoundException('Account is not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Old password not match');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newpassword, salt);

    await this.userModel.updateOne({ _id: user._id }, { password: hash });

    return true;
  }
}
