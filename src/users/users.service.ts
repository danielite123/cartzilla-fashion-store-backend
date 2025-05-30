import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          firstname: dto.firstname,
          lastname: dto.lastname,
          email: dto.email,
          password: hashedPassword,
        },
        include: {
          cart: true,
        },
      });

      return { message: 'User Created Sucessfully', user };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new HttpException('User Already exist', 404);
      }
      throw new HttpException('Internal Server Error', 500);
    }
  }

  getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async deleteUserById(userId: string) {
    const findUser = await this.getProfile(userId);

    if (!findUser) throw new HttpException('User not found', 404);

    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    const findUser = await this.getProfile(userId);

    if (!findUser) throw new HttpException('User not found', 404);

    if (data.email) {
      const emailExist = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (emailExist) throw new HttpException('User already exist', 400);
    }

    return this.prisma.user.update({ where: { id: userId }, data });
  }

  getAllUser() {
    return this.prisma.user.findMany();
  }
}
