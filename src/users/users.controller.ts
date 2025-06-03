import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Patch,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req: { userId: string }) {
    const userId = req.userId;
    const user = await this.usersService.getProfile(userId);

    if (!user) throw new HttpException('User Not Found', 404);

    return user;
  }

  @Delete('delete')
  async deleteProfile(@Req() req: { userId: string }) {
    const userId = req.userId;
    const deleteUser = await this.usersService.deleteUserById(userId);

    if (!deleteUser) throw new HttpException('User Not Found', 404);

    return { msg: 'User deleted' };
  }

  @Patch('update')
  async updateProfile(
    @Req() req: { userId: string },
    @Body() data: UpdateUserDto,
  ) {
    const userId = req.userId;
    const updateUser = await this.usersService.updateUser(userId, data);

    if (!updateUser) throw new HttpException('User Not Found', 404);

    return { msg: 'updated', data };
  }

  @Get('all-users')
  getAllUser() {
    return this.usersService.getAllUser();
  }
}
