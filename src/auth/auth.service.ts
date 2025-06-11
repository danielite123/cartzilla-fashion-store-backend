import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    if (!email) {
      throw new ForbiddenException('Invalid email');
    }

    const isUserExist = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email }],
      },
    });
    if (isUserExist) {
      throw new ConflictException('User already exists');
    }

    const password = await this.hashPassword(createUserDto.password);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password,
      },
      include: { cart: true },
    });

    return this.generateUserToken(user.id, user.role);
  }

  async registerAdmin(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    if (!email) {
      throw new ForbiddenException('Invalid email');
    }

    const isUserExist = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email }],
      },
    });
    if (isUserExist) {
      throw new ConflictException('User already exists');
    }

    const password = await this.hashPassword(createUserDto.password);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password,
        role: Role.ADMIN,
      },
      include: { cart: true },
    });

    return this.generateUserToken(user.id, user.role);
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('User does not exist');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) throw new UnauthorizedException('Inccorect password');

    return this.generateUserToken(user.id, user.role);
  }

  async loginAdmin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('User does not exist');

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied: not an admin');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) throw new UnauthorizedException('Inccorect password');

    return this.generateUserToken(user.id, user.role);
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async generateUserToken(userId: string, role: Role) {
    return {
      accessToken: await this.jwtService.signAsync({ userId, role }),
    };
  }
}
