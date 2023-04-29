export class subsmembership {
    
    private _id : string;
    private Member : string;
    private Subscription : string;
    private IsActive : Boolean;
    private Price : number;
    private Duration : number;

    constructor(subsData : any)
    {
        this._id = subsData._id;
        this.Member = subsData.Member;
        this.Subscription = subsData.Subscription;
        this.IsActive = subsData.IsActive;
        this.Price = subsData.Price;
        this.Duration = subsData.Duration;
    }
}