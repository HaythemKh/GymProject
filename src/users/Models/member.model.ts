import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "./user.model";

export class member extends User {

    public readonly Height : number;
    public readonly Weight : number;

    constructor(userData : any)
    {
        super(userData);
        this.Height = userData.Height;
        this.Weight = userData.Weight;
    }
}