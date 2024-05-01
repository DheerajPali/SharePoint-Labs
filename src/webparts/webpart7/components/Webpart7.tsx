import * as React from 'react';
import type { IWebpart7Props } from './IWebpart7Props';
import { SPFx, spfi } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { IWebpart7State } from './IWebpart7State';
import { DetailsList, IChoiceGroupOption, IColumn, SelectionMode } from 'office-ui-fabric-react';

export default class Webpart7 extends React.Component<IWebpart7Props, IWebpart7State> {

  constructor(props: IWebpart7Props) {

    const columns: IColumn[] = [
      {
        key: 'column1',
        name: 'Invoice No',
        fieldName: 'InvoiceNo',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: 'column2',
        name: 'Company Name',
        fieldName: 'CompanyName',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: 'column3',
        name: 'Invoice details',
        fieldName: 'Invoicedetails',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: 'column4',
        name: 'Company Code',
        fieldName: 'CompanyCode',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: 'column5',
        name: 'Invoice Amount',
        fieldName: 'InvoiceAmount',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: 'column6',
        name: 'Basic Value',
        fieldName: 'BasicValue',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: 'column7',
        name: 'Approver Name',
        fieldName: 'Approver',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          
          return <span>{item.ApproverTitle ? item.ApproverTitle.map((user : any) =>
            user
          ): ''
            }</span>;
        }
      },
      {
        key: 'column8',
        name: 'Approver Email',
        fieldName: 'Approver',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          return <span>{item.ApproverEMail ? item.ApproverEMail.map((user : any) =>
            user 
          ): '' 
          }</span>;
        }
      },
      {
        key: 'column9',
        name: 'IsApproved',
        fieldName: 'IsApproved',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: 'column10',
        name: 'Country',
        fieldName: 'Country',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
    ];
    
    super(props)
    this.state = ({
      InvoiceNo: Math.random().toString(),
      CompanyName: '',
      Invoicedetails: '',
      CompanyCode: '',
      InvoiceAmount: NaN,
      BasicValue: NaN,
      ApproverEMail: '',
      ApproverTitle : '',
      Approver: [],
      IsApproved: true,
      Country: '',
      columns:columns,
      CountryOptions: [],
      data: [],
    })
  }

  public async componentDidMount() {
    await this.getAll1();
  }

  public getAll1 = async () => {
    const sp: any  = spfi().using(SPFx(this.props.context));
    // await sp.web.lists.getAll();
    // const a = await sp.web.lists.getByTitle("InvoiceDetails").getAll();
    // const b = await sp.web.lists.getByTitle("Invoice Details").getAll();
    try {
      // const sp: any = spfi().using(SPFx(this.props.context));
      const allData = await sp.web.lists.getByTitle("InvoiceDetails").items.select("Approver/EMail", "Approver/Title", "InvoiceNo", "CompanyName", "Invoicedetails", "CompanyCode", "InvoiceAmount", "BasicValue", "IsApproved", "Country").expand("Approver").getAll();
      const approverEMail = allData.map((item: any) => item.Approver != undefined ? item.Approver.map((user: { EMail: any; }) => user.EMail) : null);
      const approverTitle = allData.map((item: any) => item.Approver != undefined ? item.Approver.map((user: { Title: any; }) => user.Title): null);
      const Invoice_No = allData.map((item: any) => item.InvoiceNo);
      const Company_Name = allData.map((item: any) => item.CompanyName);
      const Invoice_Details = allData.map((item: any) => item.Invoicedetails);
      const Company_Code = allData.map((item: any) => item.CompanyCode);
      const Invoice_Amount = allData.map((item: any) => item.InvoiceAmount);
      const Basic_Value = allData.map((item: any) => item.BasicValue);
      // const Approver = allData.map((item: any) => item.Approver.map((user: any) => user));
      const Is_Approved = allData.map((item: any) => item.IsApproved);
      const Country = allData.map((item: any) => item.Country);

      const myData: any = allData.map((item: any, index: string | number) => {
        return {
          ...item,
          userTitle: approverTitle[index],
          userEMail: approverEMail[index],
          Invoice_No: Invoice_No,
          Company_Name: Company_Name,
          Invoice_Details: Invoice_Details,
          Company_Code: Company_Code,
          Invoice_Amount: Invoice_Amount,
          Basic_Value: Basic_Value,
          ApproverEMail: approverEMail,
          ApproverTitle: approverTitle,
          // Approver: Approver,
          Is_Approved: Is_Approved,
          Country: Country,
          // Country_Options: [],
          // data: [],
        };
      });
      this.setState({
        data : myData,
      })
    } catch (error) {
      console.log("error",error);
    }
  }

  public render(): React.ReactElement<IWebpart7Props> {
    const options: IChoiceGroupOption[] = this.state.CountryOptions.map((option: string) => ({
      key: option,
      text: option,
      value: option,
    }));
    function _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
      console.dir(option);
    }
    return (
      <>
        <h3>Invoice Details</h3>
          <DetailsList
            items={this.state.data}
            columns={this.state.columns}
            selectionMode={SelectionMode.none}
            getKey={(item) => item.Id} // Assuming there's a unique identifier property like Id
          />
      </>
    );
  }
}
