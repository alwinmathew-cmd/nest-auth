import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable() //'my-local' is optional & no need to be passed, if 'local' def strategy used,refer passport-local.guard.ts
export class LocalStrategy extends PassportStrategy(Strategy,'my-local') {
  constructor(private authService: AuthService) {
    super({//These super() paras are optional,elsewhile,keys will be from below fn,username/password
        usernameField:'login',
        passwordField:'pass'
    });  //to call constructor of the parent class
  }
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({ username, password });//accessed in controller via decorator

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
