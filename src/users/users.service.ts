import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(
    dto: CreateUserDto,
  ): Promise<{ message: string; access_token: string }> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          fullname: dto.fullname,
          email: dto.email,
          password: hashedPassword,
        },
        include: {
          cart: true,
        },
      });

      const payload = { sub: user.id, email: user.email };
      const token = await this.jwtService.signAsync(payload);

      return { message: 'User created successfully', access_token: token };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new HttpException('User Already exist', 404);
      }
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async loginUser(
    dto: LoginUserDto,
  ): Promise<{ message: string; access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new HttpException('Invalid Email', 404);

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) throw new HttpException('Incorrect Password', 404);

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      access_token: token,
    };
  }
}
