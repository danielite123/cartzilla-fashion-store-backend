import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { AuthGuard } from 'src/guards/auth.guard';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: { userId: string }) {
    const userId = req.userId;
    const user = await this.usersService.getProfile(userId);

    if (!user) throw new HttpException('User Not Found', 404);

    return user;
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  async deleteProfile(@Req() req: { userId: string }) {
    const userId = req.userId;
    const deleteUser = await this.usersService.deleteUserById(userId);

    if (!deleteUser) throw new HttpException('User Not Found', 404);

    return { msg: 'User deleted' };
  }

  @Patch('update')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  getAllUser() {
    return this.usersService.getAllUser();
  }
}
