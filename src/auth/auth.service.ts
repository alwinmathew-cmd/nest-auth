import { Injectable, UnauthorizedException,BadRequestException, } from '@nestjs/common';
import { UsersService } from '../users/users.service'; //to access .findUserByName() from users.service.ts
import { JwtService } from '@nestjs/jwt'; //used below

// UnauthorizedException means server doesn't recognize the client, its diff from 401 Forbidden Error.
// Forbidden mean s recoginzed client but no access privelege for resource

export type AuthInput = { username: string; password: string };
type SignInData = { userId: number; username: string };
type AuthResult = { message:string,accessToken: string; userId: number; username: string };

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    // 1. Missing credentials check -> 400 Bad Request
    if (!input?.username || !input?.password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.validateUser(input);

    // 2. Invalid credentials check -> 401 Unauthorized
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findUserByName(input.username);

    if (user && user.password === input.password) {
      return { userId: user.userId, username: user.username };
    }
    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.userId,
      username: user.username,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload);
    
    // 3. Successful login response -> 200 OK
    return {
      message: 'Login successful',
      accessToken,
      userId: user.userId,
      username: user.username,
    };
  }
}