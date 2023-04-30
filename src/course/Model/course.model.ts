export class course {
    public readonly _id : string;
    public readonly Name : string;
    public readonly Trainer : string;
    public readonly Description : string;
    public readonly Capacity : number;
    public readonly Gym : string;
    public StartDate : Date;
    public EndDate : Date;
    public readonly PricePerMonth : number;


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
        this.PricePerMonth = anyData.PricePerMonth;
    }

    setStartDate(start : Date){this.StartDate = start;}
    setEndDate(end : Date){this.EndDate = end;}
}