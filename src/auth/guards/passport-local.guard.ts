import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()    //pass strategy name as para
export class PassportLocalGuard extends AuthGuard('my-local'){} //('local') is by def, if we want custom,pass it as a 
//seperate optional para in ../strategies/local.strategy.ts

// This guard is a thin wrapper that tells Passport to execute the strategy named 'my-local'