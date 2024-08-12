import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './utils/local-auth.guard';
import { JwtAuthGuard } from './utils/jwt-auth.guard';
import { User } from 'src/Model/user.entity';
import { GoogleAuthGuard } from './utils/google-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signup(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email?: string,
  ): Promise<User> {
    return this.authService.signup(username, password, email);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { googleId, email, firstName, lastName } = req.user;
    const token = await this.authService.validateGoogleUser(
      googleId,
      email,
      firstName,
      lastName,
    );
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    return res.redirect(
      `${frontendUrl}/login-success?token=${token.access_token}`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  async validate(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const user = await this.authService.validateToken(token);
    const { password, ...otherFields } = user;
    return otherFields;
  }
}
