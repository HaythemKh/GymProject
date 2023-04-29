import { CreateGymDto } from "../dto/create-gym.dto";

export class gym {

    private  _id : string;
    private  fullName : string;
    private  address : string;
    private  phone : string;
    private  Email : string;
    private  gymConfig : string;
    private  users : string[];
    private  subscriptions : string[];
    private  equipments : string[];
    private  courses : string[];


    constructor(GymData : any)
    {
        this._id = GymData._id;
        this.fullName = GymData.fullName;
        this.address = GymData.address;
        this.phone = GymData.phone;
        this.Email = GymData.Email;
        this.gymConfig = GymData.gymConfig;
        this.users = GymData.users;
        this.subscriptions = GymData.subscriptions;
        this.equipments = GymData.equipments;
        this.courses = GymData.Courses;
    }

}