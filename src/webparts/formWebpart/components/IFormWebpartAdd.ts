export interface IFormWebpartAdd{
    ItemName : string,
    ParentID : string,
    Comments:string,
    // Date : string,
    Status : string,
// }

// export interface IWebpart7Add {
    InvoiceNo: string;
    CompanyName: string;
    Invoicedetails: string;
    CompanyCode: string;
    InvoiceAmount: number;
    BasicValue: number;
    // ApproverEMail: string,
    // ApproverTitle : string,
    Approver: any;
    IsApproved: boolean;
    Country: string;
    // User : string,
    // columns: any;
    // CountryOptions: [];
    colData: any;
    ItemID : string,
    columns: any,
    editID : number,
    IsDeleted : boolean,
}