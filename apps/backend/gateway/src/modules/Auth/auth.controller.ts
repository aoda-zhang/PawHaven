import { Body, Controller, Post } from '@nestjs/common';
// import CreateUserDTO from '@shared/DTO/Auth/create-user.dto';
import type { Schema } from 'mongoose';

import type { AuthService } from './auth.service';
import NoToken from './decorators/noToken.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @NoToken()
  @Post('v1/register')
  register(@Body() userInfo: any) {
    return this.authService.register(userInfo);
  }

  @NoToken()
  @Post('v1/login')
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async login(@Body() userInfo: { userName: string; password: string }) {
    return this.authService.login(userInfo?.userName, userInfo?.password);
  }

  @NoToken()
  @Post('v1/refresh')
  async refresh(
    @Body()
    body: {
      refreshToken: { userName: string; userID: Schema.Types.ObjectId };
    },
  ) {
    return this.authService.refresh(body?.refreshToken);
  }
}
