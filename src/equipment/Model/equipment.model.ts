export class equipment {

    public readonly  _id : string;
    public readonly  Name : string;
    public readonly  Description : string;
    public readonly  Availability : Boolean;
    public readonly  Image : string;
    public readonly  Gym : string;

    constructor(anyData : any)
    {
        this._id = anyData._id;
        this.Name = anyData.Name;
        this.Description = anyData.Description;
        this.Availability = anyData.Availability;
        this.Image = anyData.Image;
        this.Gym = anyData.Gym;
    }



}