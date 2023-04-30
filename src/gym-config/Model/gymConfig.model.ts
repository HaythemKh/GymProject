export class gymConfig{

    public readonly  _id : string;
    public readonly  OpeningTime : Date;
    public readonly  ClosingTime : Date;
    public readonly  Logo : string;
    public readonly  Color : string;

    constructor(configData : any)
    {
        this._id = configData._id;
        this.OpeningTime = configData.OpeningTime;
        this.Logo = configData.Logo;
        this.Color = configData.Color;
        this.ClosingTime = configData.ClosingTime;
    }

}