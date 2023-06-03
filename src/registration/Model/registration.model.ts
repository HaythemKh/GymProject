export class registration {
    public readonly _id : string;
    public readonly Member : string;
    public readonly Course : string;
    public readonly IsActive : Boolean
    public readonly Duration : number;
    public readonly Price : number;

    constructor(Data : any){
        this._id = Data._id;
        this.Member = Data.Member;
        this.Course = Data.Course;
        this.IsActive = Data.IsActive;
        this.Duration = Data.Duration;
        this.Price = Data.Price;
    }
}