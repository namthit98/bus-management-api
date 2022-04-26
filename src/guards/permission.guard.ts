import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import {isArray} from 'lodash'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<string[]>(
      'permission',
      context.getHandler(),
    );

    if(!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if(!request || !request.user) {
      throw new UnauthorizedException(
        {
          message: 'unauthorized',
          data: null,
          errors: 'unauthorized',
        },
      );
    }

    if(isArray(permission) && permission.includes(request?.user?.role)) {
        return true;
    }

    if(permission === request?.user?.role) {
        return true;
    }

    throw new UnauthorizedException(
      {
        message: 'unauthorized',
        data: null,
        errors: 'unauthorized',
      },
    );
  }
}
