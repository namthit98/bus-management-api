import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';
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

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
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

  async findAll() {
    const users = await this.userModel.find();

    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({
      _id: id,
      deleted: false,
    });

    if (!user) {
      throw new NotFoundException('User is not found.');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    await this.userModel.updateOne({ _id: user._id }, { ...updateUserDto });

    return true;
  }

  async remove(id: string) {
    const user = await this.findOne(id);

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

  async changePassword(currentUser: User, { oldpassword, password }) {
    const user = await this.userModel.findOne({
      _id: currentUser?._id,
      deleted: false,
    });

    if (!user) {
      throw new NotFoundException('Account is not found');
    }

    const isMatch = await bcrypt.compare(oldpassword, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Sai mật khẩu cũ');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    await this.userModel.updateOne({ _id: user._id }, { password: hash });

    return true;
  }
}
