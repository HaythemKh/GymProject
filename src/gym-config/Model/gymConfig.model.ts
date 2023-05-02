export class gymConfig{

    public readonly  _id : string;
    public readonly  OpeningTime : Date;
    public readonly  ClosingTime : Date;
    public readonly  Logo : string;
    readonly BackgroundLightMode : string;
    readonly BackgroundDarkMode : string;
    readonly TextColorLightMode : string;
    readonly TextColorDarkMode : string;
    readonly BtnColorLightMode : string;
    readonly BtnColorDarkMode : string;

    constructor(configData : any)
    {
        this._id = configData._id;
        this.OpeningTime = configData.OpeningTime;
        this.Logo = configData.Logo;
        this.BackgroundLightMode = configData.BackgroundLightMode;
        this.BackgroundDarkMode= configData.BackgroundDarkMode;
        this.TextColorLightMode = configData.TextColorLightMode;
        this.TextColorDarkMode = configData.TextColorDarkMode;
        this.BtnColorLightMode = configData.BtnColorLightMode;
        this.BtnColorDarkMode = configData.BtnColorDarkMode;

        this.ClosingTime = configData.ClosingTime;
    }

}