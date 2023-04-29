export class subscription {

    public readonly _id : string;
    public readonly Name : string;
    public readonly Description : string;
    public readonly PricePerMonth : number;
    public readonly Gym : string;

    constructor(subscriptionData : any)
    {
        this._id = subscriptionData._id;
        this.Name = subscriptionData.Name;
        this.Description = subscriptionData.Description;
        this.PricePerMonth = subscriptionData.PricePerMonth;
        this.Gym = subscriptionData.Gym;
    }
    




}