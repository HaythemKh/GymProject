import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "./user.model";

export class trainer extends User {

   private  Salary : number;

   constructor(userData :any)
   {
      super(userData);
      this.Salary = userData.Salary;
   }
 

}