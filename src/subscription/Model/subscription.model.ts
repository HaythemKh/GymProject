export class subscription {

    public readonly _id : string;
    public readonly Name : string;
    public readonly Description : string;
    public readonly Price : string;
    public readonly Duration : string;
    public readonly Gym : string;

    constructor(subscriptionData : any)
    {
        this._id = subscriptionData._id;
        this.Name = subscriptionData.Name;
        this.Description = subscriptionData.Description;
        this.Price = subscriptionData.Price;
        this.Duration = subscriptionData.Duration;
        this.Gym = subscriptionData.Gym;
    }
    




}