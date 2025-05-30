import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('User does not exist');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) throw new UnauthorizedException('Inccorect password');

    const token = this.generateUserToken(user.id, user.role);

    return { token, userId: user.id, role: user.role };
  }

  generateUserToken(userId: string, role: Role) {
    const accessToken: string = this.jwtService.sign(
      { userId, role },
      { expiresIn: '1h' },
    );

    return { accessToken };
  }
}
