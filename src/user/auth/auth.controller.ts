import {
  Controller,
  Post,
  Body,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SighUpDTO, SignInDTO } from '../dtos/auth.dto';
import { User } from '../decorators/user.decorator';
import { UserInterceptorType } from 'types/user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/me')
  async getMe(@User() user: UserInterceptorType) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.getMe(user.id);
  }
  @Post('/signUp')
  async signUp(@Body() userRegisterData: SighUpDTO) {
    return this.authService.signUp(userRegisterData);
  }
  @Post('/signIn')
  async signIp(@Body() userSighInData: SignInDTO) {
    return this.authService.signIn(userSighInData);
  }
}
