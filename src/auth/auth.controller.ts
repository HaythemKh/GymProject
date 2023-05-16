import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ResetPasswordDto, SendEmailDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signin")
  async signInLocal(@Body() login : AuthDto) : Promise<any>{
    return await this.authService.signInLocal(login);
  }

  @Post("/signinUser")
  async signInUserMobile(@Body() login : AuthDto) : Promise<any>{
    return await this.authService.signInUser(login);
  }

  @Post("/forget-password")
  async forgotPassword(@Body() forgotPasswordDto : SendEmailDto) : Promise<any>{
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post("/reset-password")
  async resetPassword(@Body() resetPasswordDto : ResetPasswordDto) : Promise<any>{
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
