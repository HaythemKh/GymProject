export class notification{

    readonly User : string;

    readonly Gym : string;

    readonly Title : string;

    readonly Message : string;


    constructor(data : any)
    {
        this.User = data.User;
        this.Gym = data.Gym;
        this.Title = data.Title;
        this.Message = data.Message;
    }
}