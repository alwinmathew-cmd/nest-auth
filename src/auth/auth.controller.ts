import { Controller,Body,HttpCode,HttpStatus,NotImplementedException,Post,Get, UseGuards,Request} from '@nestjs/common';

import {AuthService} from './auth.service';
import { AuthGuard } from './guards/auth.guards';
import type {AuthInput} from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    //authentication at login (getting token)
    @HttpCode(HttpStatus.OK)//by def,Post returns 201 CREATE status, with enum HttpStatus.OK, we make it 200 OK, 
    @Post('login')                                       //as fn is authenticating at login, not creating/sending data
    login(@Body() input:AuthInput){
        return this.authService.authenticate(input);
    }

// Restricted endpint, ie login, so guard used here
    @UseGuards(AuthGuard)
    @Get('me')
    getUserInfo(@Request() request: Request & { user: { userid: number; username: string } }) {
        return request.user;//check AUthGuard class for info
    }

}
// Type hints from above code, u can switch to any for simplicity for now.
// Request: "Hey, this is a standard Express HTTP request object."

// & { user: { userid: number; username: string } }: "And specifically, it also has a user property attached to it, 
// which contains a userid number and a username string."