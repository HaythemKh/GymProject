import { User } from "./user.model";
import { Injectable, Optional, Inject } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class admin extends User {
    
    constructor(userData :any)
    {
        super(userData);
    }
    
    


}