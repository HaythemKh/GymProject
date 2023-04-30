import { CreateGymDto } from "../dto/create-gym.dto";

export class gym {

    public readonly  _id : string;
    public readonly  fullName : string;
    public readonly  address : string;
    public readonly  phone : string;
    public readonly  Email : string;
    public readonly  gymConfig : string;
    public readonly  users : string[];
    public readonly  subscriptions : string[];
    public readonly  equipments : string[];
    public readonly  courses : string[];


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