import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { Authorization } from 'src/decorators/authorization.decorator';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dtos/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('/me')
  @Authorization(true)
  async me(@Request() req: any) {
    return req?.user;
  }
}
