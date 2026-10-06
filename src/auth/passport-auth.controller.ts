import {Controller,Post,Get,HttpCode,HttpStatus,NotImplementedException, UseGuards,Request} from '@nestjs/common';
import {AuthService} from './auth.service';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { PassportJwtAuthGuard } from './guards/passport-jwt.guard';

@Controller('auth-v2')
export class PassportAuthController{
    constructor(private authService:AuthService){}

    @UseGuards(PassportLocalGuard) //PassportLocalGuard only knows how to check passwords (raw credentials).
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Request() request:any){
        return this.authService.signIn(request.user); //Try putting same var name in place of request,say abc it works
    }                                               //request here is Express.js request object- u can name it any var
    
    @UseGuards(PassportJwtAuthGuard)
    @Get('me')
    getUserInfo(@Request() request:any){
    return request.user;                //not same as above one, from encrypted payload
    }

}

// Notes:

// @Request() helps us access the whole HTTP request body, writing a ref-var name beside it (could be request or 
// anything at all we choose),
//helps assign the req object to var, to reuse the var in code beneath.


