// Maybe  used more than passport-local

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt,Strategy } from "passport-jwt";

import {JWT_SECRET} from '../../configs/jwt-secret';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey: JWT_SECRET
        })
    }

    async validate(payload:{sub:string,username:string}){
        return {sub:payload.sub,username:payload.username};
    }
}

// Where did verifyAsync() go?

// By passing jwtFromRequest and secretOrKey into super(), you are handing Passport the instructions and the 
// secret key. Passport automatically runs the cryptographic verification (the equivalent of verifyAsync) in the
// background before your code even executes.

// STeps:

    //1) Request
    // Client hits GET /auth-v2/me with header:
    // Authorization: Bearer <token>

    //2) Guard Intercepts
    // @UseGuards() pauses request
    // before controller handler runs.

    //3) Extract & Verify
    // Passport extracts header token
    // and verifies signature with secret.

    //4) validate() Runs
    // If signature is valid,
    // Passport decodes token payload
    // and calls validate(payload).

    //5) req.user Attached
    // Passport attaches returned user
    // data directly to request.user.
    // Controller reads it from memory