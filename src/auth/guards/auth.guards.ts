import { CanActivate,ExecutionContext,Injectable, UnauthorizedException }  from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

// Guard Class
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService:JwtService){}//to use JwtService's .verifyAsync()
 async canActivate(context:ExecutionContext):Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization  // 'Extracting val like "Bearer secret_token_12345" '
    const token = authorization?.split(' ')[1]; // getting rid of Bearer, and extracting raw val

    if(!token){
        throw new UnauthorizedException();
    }

    try{
        const tokenPayload = await this.jwtService.verifyAsync(token);//uses server's secret key to check the cryptographic signature.
        request.user = {
            userid:tokenPayload.sub,
            username:tokenPayload.username
        }
        return true;
    }
    catch(error){
        throw new UnauthorizedException();
    }
 }
}

// Notes:
// 1) Step 1: Setting up the Guard Class
// (AuthGuard implements CanActivate): ,line 6
// This is a rule in NestJS. Any guard class you write must implement CanActivate(interface), 
// which forces you to write a method called canActivate. If you don't name it canActivate, NestJS won't recognize 
// it as a guard.


// 2) The Main Entry Function ,line 8
//canActivate(): This is the method NestJS automatically runs before letting a user reach your controller route.
//context: ExecutionContext: Think of context as a giant package containing all the details about the current 
// incoming request. NestJS passes this into your guard.


// 3) Getting the Request Object (request variable) ,line 9
// What request holds: This is the standard Express HTTP req object. It holds everything the client sent:
//  req.body, req.query, and crucially, req.headers.

// Why we do it: Because NestJS can handle WebSockets, GraphQL, and HTTP, 
// context.switchToHttp().getRequest() 
// tells NestJS: "Hey, translate this context specifically into a standard HTTP Request so I can look at its headers."


// Step 4: Grabbing the Authorization Header (authorization variable, line 10)
// request_var.headers.authorization  : multiple headers exist,we retrieve authorization header
// What authorization holds: When a frontend app sends a request, it attaches a header that looks like this:
// authorization: "Bearer eyJhbGciOiJIUzI1NiIsIn..."

// So, the value of the authorization variable right here is that entire string: "Bearer eyJhbGciOiJIUzI1NiIsIn...".
// (Note: If the frontend forgot to send the header, authorization will be undefined).


// Step 5: Extracting the Raw Token (token variable, line 11)
// This line is pure JavaScript string manipulation. Let’s break it down into two pieces:

// 5.1) authorization?.split(' '):    seperate by space, and take 2nd value, ie raw token
// The ?. (optional chaining) safely checks if authorization exists so your app doesn't crash if it's undefined. 
// Then, .split(' ') takes the header string and chops it into an array wherever there is a space:

// Array result: ['Bearer', 'eyJhbGciOiJIUzI1NiIsIn...']

// 5.2) [1]:
// This grabs the item at index 1 of that array (the second item), which drops the word "Bearer" and leaves 
// only the actual token string:
// Value of token: "eyJhbGciOiJIUzI1NiIsIn..."

///////////////////////////////////////////////////////////////////////////////////////

// 6)try block:

// 6.1) verifyAsync(): t checks two critical things:

// Is this a fake token? (Did a hacker try to tamper with it?)
// Is it expired?

// The Result: If it's valid, it unpacks the data hidden inside the token and saves it into tokenPayload variable.
// If it fails or is expired, it immediately jumps to the catch (error) block and throws an UnauthorizedException 
// (kicking them out).

//Ex of HTTP Request object: Comprises of HTTP headers &  HTTP Body/PayLoad:

    // POST /api/login HTTP/1.1
    // Host: example.com
    // Content-Type: application/json
    // Authorization: Bearer xyz123token

    // {
    //   "username": "johndoe",
    //   "password": "securepassword123"
    // }

//above, former part is HTTP headers, and stuff in {} is HTTP body/payload

// 6.2)Attaching the User (request.user = ...)
// Why are we doing this? We aren't really "overwriting" something important; we are attaching a brand new user 
// property directly onto the HTTP request object.
// The Flow:

// The AuthGuard runs first (before your controller even sees the request).

// It verifies the token and grabs the userid and username.

// It tags that data onto request.user.

// NestJS then passes that exact same request object straight into your controller method (getUserInfo(@Request() request)).

// The Benefit: This is why your controller can instantly know who is asking for data without having to query the database. The guard already did the work and handed over the user's ID.




// 7) Letting Them Through (return true;)
// What it does: This is the final green light. It tells NestJS: "All checks passed, let the user proceed to their
//  destination controller route."

///////////////////////////////////////////////////////////////////////


// Understanding request variable once more:

// Here is a quick look under the hood. Think of the `request` object as a backpack traveling from the client,
//  through your guard, and into your controller.

// Here is what that backpack looks like at different stages:

// ### Stage 1: Right after `context.switchToHttp().getRequest();`

// When the request first arrives from Postman, it contains all the raw HTTP data, but **it does not have a `user`
//  property yet.**


// // What the request object looks like initially:
    // request = {
    //   method: 'GET',
    //   url: '/auth/me',
    //   headers: {
    //     authorization: 'Bearer eyJhbGciOiJIUzI1NiIsIn...'
    //   },
    //   body: {},
    //   // ❌ Notice: There is NO 'user' property here yet!
    // }

// ```

// ---

// ### Stage 2: Inside the Guard (After verifying the token)

// Your guard decodes the token, extracts the user data (`sub: 1, username: 'bob'`), and **manually glues a new `user` property onto that exact same `request` object**:


// // The guard in controller,above method runs this line:
    // request.user = {
    //     userid: 1,
    //     username: 'bob'
    // };

// ```

// ---

// ### Stage 3: When it reaches your Controller (`getUserInfo`)

// Because the guard modified that `request` object in-place, the backpack now carries the user data right into your controller method:


// // What the request object looks like when it hits your controller:
    // request = {
    //   method: 'GET',
    //   url: '/auth/me',
    //   headers: { ... },
    //   body: {},
    
    //   // ✅ Look! The user data is now permanently attached to the request
    //   user: {
    //     userid: 1,
    //     username: 'bob'
    //   }
    // }


// ### Why do this?

// When you write `return request.user;` in your controller, you are literally just pulling out that `user` 
// property that the guard conveniently attached for you along the way!