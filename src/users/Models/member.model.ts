import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "./user.model";

export class member extends User {

    constructor(userData : any)
    {
        super(userData);
    }
}