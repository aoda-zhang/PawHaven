import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { PawhavenService } from './pawhaven.service';

@Controller('pawhaven')
export class PawhavenController {
  constructor(private readonly pawhavenService: PawhavenService) {}

  @Post('v1/login')
  login(@Res({ passthrough: true }) res: Response) {
    const user = this.pawhavenService.login();
    res.cookie('accessToken', 'ACCESS_TOKEN_VALUE', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 天
    });

    res.cookie('refreshToken', 'REFRESH_TOKEN_VALUE', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 天
    });

    return { message: 'Logged in', user };
  }
}
