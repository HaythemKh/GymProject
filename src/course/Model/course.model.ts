export class course {
    public readonly _id : string;
    public readonly Name : string;
    public readonly Trainer : string;
    public readonly Description : string;
    public readonly Capacity : number;
    public readonly Gym : string;
    public readonly StartDate : Date;
    public readonly EndDate : Date;
    public readonly PricePerMonth : number;
    public readonly daysOfWeek: number[];
    public readonly Equipments: string[];


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
        this.daysOfWeek = anyData.daysOfWeek;
        this.Equipments = anyData.Equipments;
    }

}