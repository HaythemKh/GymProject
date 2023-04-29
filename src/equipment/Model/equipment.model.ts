export class equipment {

    private  _id : string;
    private  Name : string;
    private  Description : string;
    private  Availability : string;
    private  Image : string;
    private  Gym : string;

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