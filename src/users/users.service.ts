import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
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
