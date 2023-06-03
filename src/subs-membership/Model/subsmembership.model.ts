export class subsmembership {
    
    public readonly _id : string;
    public readonly Member : string;
    public readonly Subscription : string;
    public readonly IsActive : Boolean;
    public readonly Price : number;
    public readonly Duration : number;
    public readonly createdAt : Date;

    constructor(subsData : any)
    {
        this._id = subsData._id;
        this.Member = subsData.Member;
        this.Subscription = subsData.Subscription;
        this.IsActive = subsData.IsActive;
        this.Price = subsData.Price;
        this.Duration = subsData.Duration;
        this.createdAt = subsData.createdAt;
    }
}