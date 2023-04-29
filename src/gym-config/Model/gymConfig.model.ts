export class gymConfig{

    private  _id : string;
    private  OpeningTime : Date;
    private  ClosingTime : Date;
    private  Logo : string;
    private  Color : string;

    constructor(configData : any)
    {
        this._id = configData._id;
        this.OpeningTime = configData.OpeningTime;
        this.Logo = configData.Logo;
        this.Color = configData.Color;
        this.ClosingTime = configData.ClosingTime;
    }

}