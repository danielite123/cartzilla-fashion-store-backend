import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { SKIP_AUTH_KEY } from './auth.decorator';
import { configurations } from 'src/config/configurations';

interface JwtPayload {
  userId: string;
  [key: string]: any;
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    const errorMessage = {
      message: 'Invalid or expired token',
      errorCode: 'invalid_or_expired_access_token',
      statusCode: HttpStatus.UNAUTHORIZED,
    };

    if (!token) {
      throw new UnauthorizedException(errorMessage);
    }

    try {
      const user = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET || configurations().auth.jwt,
      });

      const { userId } = user;
      request['userId'] = userId;

      const dbUser = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      request['user'] = { ...user, ...dbUser };
    } catch {
      throw new UnauthorizedException(errorMessage);
    }

    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
