import { Injectable } from '@nestjs/common';

export type User = {
    userId:number;
    username:string;
    password:string;
}

const users:User[] = [
{    userId:1,
    username:"Alice",
    password:"topsecret"
},
{    userId:2,
    username:"Bob",
    password:"123abc"
}
];

@Injectable()
export class UsersService {
    async findUserByName(username:string):Promise<User | undefined>{
        return users.find((user) => user.username === username)
    }
}
// find user, return type is either valid user or undefined, such promise written

//where async is used, return type needs to be a Promise.

//where fetch is used, it handles promises by itself, so essentially Promise always promises either of return types,
// or a single return type. And async is used on a function where theres gonna be a time lag for some process to 
// finish; and then, some other place where this time lag fn is invoked, it'll need to use await, so that code doesnt 
// proceed until this is fully run