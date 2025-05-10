import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private _authservice: AuthService) {}

  @Post('signup')
  signup() {
    return this._authservice.signup();
  }
  
  @Post('signin')
  signin(){
    return this._authservice.signin();
  }
}