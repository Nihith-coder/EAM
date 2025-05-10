import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup(): any {
    return { msg: 'I am signed up'};
  }

  signin(): any {
    return { msg: 'I am signed in'};
  }
}
