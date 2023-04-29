export class registration {
    private _id : string;
    private Member : string;
    private Course : string;
    private IsActive : Boolean;
    private Price : number;
    private Duration : number;

    constructor(Data : any){
        this._id = Data._id;
        this.Member = Data.Member;
        this.Course = Data.Course;
        this.IsActive = Data.IsActive;
        this.Duration = Data.Duration;
        this.Price = Data.Price;
    }
}