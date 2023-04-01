export class course {
    private _id : string;
    private Name : string;
    private Trainer : string;
    private Description : string;
    private Capacity : number;
    private Gym : string;
    private StartDate : Date;
    private EndDate : Date;


    constructor(anyData : any)
    {
        this._id = anyData._id;
        this.Name = anyData.Name;
        this.Trainer = anyData.Trainer;
        this.Description = anyData.Description;
        this.Capacity = anyData.Capacity;
        this.Gym = anyData.Gym;
        this.StartDate = anyData.StartDate;
        this.EndDate = anyData.EndDate;
    }

    setStartDate(start : Date){this.StartDate = start;}
    setEndDate(end : Date){this.EndDate = end;}
}