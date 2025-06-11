import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto';
import { SkipAuth } from 'src/guards/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('register')
  register(@Body() credentials: CreateUserDto) {
    return this.authService.register(credentials);
  }

  @SkipAuth()
  @Post('register/admin')
  registerAdmin(@Body() credentials: CreateUserDto) {
    return this.authService.registerAdmin(credentials);
  }

  @SkipAuth()
  @Post('login')
  login(@Body() credentials: AuthDto) {
    return this.authService.login(credentials);
  }

  @SkipAuth()
  @Post('login/admin')
  loginAdmin(@Body() credentials: AuthDto) {
    return this.authService.loginAdmin(credentials);
  }
}
