
export class report {
    readonly _id : string;
    readonly UserID : string;
    readonly DateTime : Date;
    readonly Description : string;

    constructor(reportData : any){
        this._id = reportData._id;
        this.UserID = reportData.UserID;
        this.DateTime = reportData.DateTime;
        this.Description = reportData.Description;
    }
}