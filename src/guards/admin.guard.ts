import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthenticatedRequest } from './authenticated-request';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Invalid Token');
    }

    try {
      const payload = this.jwtService.verify<{
        userId: string | number;
        role: Role;
      }>(token);

      if (payload.role !== Role.ADMIN) {
        throw new UnauthorizedException('Access denied: Admins only');
      }

      request.userId = payload.userId;
      request.role = payload.role;
    } catch (e: any) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      Logger.error(e);
      throw new UnauthorizedException('Invalid Token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}
