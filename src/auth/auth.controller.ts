import { Controller,Body,HttpCode,HttpStatus,NotImplementedException,Post,Get, UseGuards,Request} from '@nestjs/common';

import {AuthService} from './auth.service';
import { AuthGuard } from './guards/auth.guards';
import type {AuthInput} from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){

    }

    //authentication at login
    @HttpCode(HttpStatus.OK)//by def,Post returns 201 CREATE status, with enum HttpStatus.OK, we make it 200 OK, 
    @Post('login')                                       //as fn is authenticating at login, not creating/sending data
    login(@Body() input:AuthInput){
        return this.authService.authenticate(input);
    }

    // @UseGuards(AuthGuard)
    // @Get('me')
    // getUserInfo(@Request() request){
    //     return request.user;
    // }
}
