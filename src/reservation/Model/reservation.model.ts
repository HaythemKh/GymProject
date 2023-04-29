export class reservation{

    private  _id : string;
    private  User : string;
    private  Equipment : string;
    private  Start_time : Date;
    private  End_time : Date;

    constructor(anyData : any)
    {
        this._id = anyData._id;
        this.User = anyData.User;
        this.Equipment = anyData.Equipment;
        this.Start_time = anyData.Start_time;
        this.End_time = anyData.End_time;
    }

    setStartDate(time : string){this.Start_time = new Date(time);}
    setEndDate(time : string){this.End_time = new Date(time);}
    

}