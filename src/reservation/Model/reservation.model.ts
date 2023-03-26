export class reservation{

    public readonly _id : string;
    public readonly User : string;
    public readonly Equipment : string;
    public readonly Start_time : Date;
    public readonly End_time : Date;

    constructor(anyData : any)
    {
        this._id = anyData._id;
        this.User = anyData.User;
        this.Equipment = anyData.Equipment;
        this.Start_time = anyData.Start_time;
        this.End_time = anyData.End_time;
    }

}