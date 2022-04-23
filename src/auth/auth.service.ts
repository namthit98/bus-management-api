import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/users/users.interface';
import { LoginAuthDto } from './dtos/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const existedUser = await this.userModel.findOne({
      username: loginAuthDto.username,
    });

    if (!existedUser) {
      throw new NotFoundException('Username is not found.');
    }

    const isMatch = await bcrypt.compare(
      loginAuthDto.password,
      existedUser.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Password is not right.');
    }

    if (!existedUser.active) {
      throw new UnauthorizedException('Account is locked.');
    }

    const token = this.jwtService.sign(
      {
        user_id: existedUser._id,
      },
      {
        expiresIn: 24 * 60 * 60,
      },
    );

    return {
      token,
      user: existedUser,
    };
  }
}
