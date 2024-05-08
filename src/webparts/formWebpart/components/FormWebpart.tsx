import * as React from 'react';
import { IFormWebpartProps } from './IFormWebpartProps';
import { DefaultButton, PrimaryButton, TextField, Dropdown, DatePicker, Label, Toggle, IChoiceGroupOption, IDropdownOption } from 'office-ui-fabric-react';
import { spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/fields";
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import { IWebpart7Add } from './IFormWebpartAdd';
import { Field } from '@pnp/sp/fields';

export default class FormWebpart extends React.Component<IFormWebpartProps, any> {
  constructor(props: IFormWebpartProps) {
    super(props);
    this.state = {
      Status: '',
      data: [{ Date: new Date(), ItemName: '', ParentID: '', Comments: '' },
      { Date: new Date(), ItemName: '', ParentID: '', Comments: '' }
      ],
      options: [],


      InvoiceNo: Math.floor(Math.random() * 1000000).toString(),
      CompanyName: '',
      Invoicedetails: '',
      CompanyCode: '',
      InvoiceAmount: NaN,
      BasicValue: NaN,
      Approver: [],
      // User: '',
      IsApproved: false,
      Country: '',
      CountryOptions: [],
    };
  }

  public componentDidMount = async () => {
    await this.fetchChoiceOptions();
  }

  public async fetchChoiceOptions(): Promise<void> {
    const sp: any = spfi().using(SPFx(this.props.context));
    const fieldSchema = await sp.web.lists.getByTitle("InvoiceDetails").fields.getByInternalNameOrTitle("Country")();
    console.log("fieldScema", fieldSchema);
    if (fieldSchema && fieldSchema.Choices) {
      this.setState({ CountryOptions: fieldSchema.Choices });
    }
  }


  //this method is created to handle changes in text field, the value which is in textfield will be set here as state.
  private handleChange = (index: number, fieldName: string, value: string) => {
    const { data } = this.state;
    data[index][fieldName] = value;
    this.setState({ data });
  }

  //this method is created to handle changes in Lookup field, the value which is in lookupfield will be set here as state.
  private handleChangeLookup = (index: number, fieldName: string, value: string) => {
    const { data } = this.state;
    data[index][fieldName] = value;
    this.setState({ data });
  }

  //this method will add another blank row in your webpart
  private handleAddRow = () => {
    const { data } = this.state;
    data.push({ Date: new Date(), ItemName: '', ParentID: '', Comments: '' });
    this.setState({ data });
  }

  //this method will add your state data by fetching each record in your ChildList.
  private handleSave = async (itemId: any, status: string) => {
    const { data } = this.state;


    // const validationErrors: { [key: string]: string }[] = [];

    // // Perform field-specific validation for each record in 'data'
    // data.forEach((record: { Date: string | number | Date; ItemName: string; ParentID: string; Comments: string; }, index: any) => {
    //   const errors: { [key: string]: string } = {};

    //   // Validate Date (ensure it's not null or invalid)
    //   if (!record.Date || isNaN(new Date(record.Date).getTime())) {
    //     errors[`Date_${index}`] = 'Please enter a valid Date';
    //   }

    //   // Validate ItemName (ensure it's not empty)
    //   if (!record.ItemName.trim()) {
    //     errors[`ItemName_${index}`] = 'Please enter Item Name';
    //   }

    //   // Validate Comments (ensure it's not empty)
    //   if (!record.Comments.trim()) {
    //     errors[`Comments_${index}`] = 'Please enter Comments';
    //   }

    //   // Push errors for the current record to validationErrors array
    //   if (Object.keys(errors).length > 0) {
    //     validationErrors.push(errors);
    //   }
    // });

    // // Check if there are any validation errors
    // if (validationErrors.length > 0) {
    //   // Display validation error messages for each field
    //   // validationErrors.forEach(errors => {
    //   //   // Object.keys(errors).forEach(fieldName => {
    //   //   //   alert(errors[fieldName]); // Show error message for each field
    //   //   // });
    //   // });
    //   alert('Please fill out other required fields')
    //   return; // Stop further execution if there are validation errors
    // }

    try {
      const sp: any = spfi().using(SPFx(this.props.context));
      const list = sp.web.lists.getByTitle("ChildList");
      const statusValue = status.toString();
      for (const record of data) {
        await list.items.add({
          Date: record.Date,
          ItemName: record.ItemName,
          ParentIDId: parseInt(itemId),
          Comments: record.Comments,
          Status: statusValue,
        });
      }
      // here we're clearing all the filled data after submission.
      this.setState({
        data: [{ Date: new Date(), ItemName: '', ParentID: '', Comments: '' },
        { Date: new Date(), ItemName: '', ParentID: '', Comments: '' }
        ],
      });
    } catch (error) {
      console.log('Error saving records:', error);
    }
  }

  //This method will update status as Draft

  public handleDraft = (): void => {
    const status = "Draft"
    this.handleAdd(status); // Call handleAdd after setting the status to 'Draft'
  };

  public handleSubmit = (): void => {
    const status = "Submit"
    this.handleAdd(status); // Call handleAdd after setting the status to 'Submit'
  };

  private handleDeleteRow = (index: number) => {
    const { data } = this.state;
    const newData = [...data.slice(0, index), ...data.slice(index + 1)];
    this.setState({ data: newData });
  }

  handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value
    this.setState({
      [name]: value,
    } as unknown as Pick<IWebpart7Add, keyof IWebpart7Add>);
  }


  handleDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: { key: string | number }) => {
    if (option) {
      this.setState({ Country: option.key as string });
    }
  }

  public onPeoplePickerChange = (items: any[]) => {
    this.setState({ Approver: items });
  }

  public handleDateChange = (date: Date | null | undefined, index: number, field: string) => {
    if (date) {
      const newData = [...this.state.data];
      newData[index][field] = date;
      this.setState({ data: newData });
    }
  }

  private handleToggleChange = (checked: boolean) => {
    this.setState({ IsApproved: checked });
  };

  handleAdd = async (status: string): Promise<void> => {
    const { InvoiceNo, CompanyName, Invoicedetails, CompanyCode, InvoiceAmount, BasicValue, Country, IsApproved, Approver
    } = this.state as {
      InvoiceNo: string;
      CompanyName: string;
      Invoicedetails: string;
      CompanyCode: string;
      InvoiceAmount: number;
      BasicValue: number;
      Country: string;
      IsApproved: boolean,
      Approver: any,
    }
    const validationErrors: { [key: string]: string } = {};

    if (!InvoiceNo) {
      validationErrors.InvoiceNo = 'Please enter Invoice No';
    }
    if (!CompanyName) {
      validationErrors.CompanyName = 'Please enter Company Name';
    }
    if (!Invoicedetails) {
      validationErrors.Invoicedetails = 'Please enter Invoice Details';
    }
    if (!CompanyCode) {
      validationErrors.CompanyCode = 'Please enter Company Code';
    }
    if (isNaN(InvoiceAmount) || InvoiceAmount <= 0) {
      validationErrors.InvoiceAmount = 'Please enter a valid Invoice Amount';
    }
    if (isNaN(BasicValue) || BasicValue <= 0) {
      validationErrors.BasicValue = 'Please enter a valid Basic Value';
    }
    if (!Country) {
      validationErrors.Country = 'Please select a Country';
    }
    if (!Approver || Approver.length === 0) {
      validationErrors.Approver = 'Please select at least one Approver';
    }

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      // // Display validation error messages for each field
      // Object.keys(validationErrors).forEach(fieldName => {
      //   alert(validationErrors[fieldName]); // Show error message for each field
      // });
      alert('Please fill all the mendatory fields.')
      return; // Stop further execution if there are validation errors
    }


    const sp: any = spfi().using(SPFx(this.props.context));
    const approverIds = Approver && Approver.map((person: { id: any; }) => person.id);
    try {
      // const user = selectectedPerson.id;

      const list = await sp.web.lists.getByTitle("InvoiceDetails").items.add({
        'InvoiceNo': InvoiceNo,
        'CompanyName': CompanyName,
        'Invoicedetails': Invoicedetails,
        'CompanyCode': CompanyCode,
        'InvoiceAmount': InvoiceAmount,
        'BasicValue': BasicValue,
        'Country': Country,
        ApproverId: approverIds,
        'IsApproved': IsApproved
      });
      const addedItemId = list.data.Id;
      // this.handleSubmit(addedItemId);
      const statusValue = status.toString();
      await this.handleSave(addedItemId, statusValue);
      this.setState({ InvoiceNo: Math.floor(Math.random() * 10000000).toString(), CompanyName: '', Invoicedetails: '', CompanyCode: '', InvoiceAmount: NaN, BasicValue: NaN, Country: '', Approver: [], IsApproved: false });
      alert('Added Successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }

  }

  public render(): React.ReactElement<IFormWebpartProps> {
    const { data } = this.state;
    const options: IDropdownOption[] = this.state.CountryOptions.map((option: string) => ({
      key: option,
      text: option,
      value: option,
    }));

    return (
      <>
        <div >
          <div >
            <div >
              <div >
                <h5 > Invoice Details
                </h5>
                <div >
                </div>
                <div >
                  <div >
                    <TextField label="Invoice No " name="InvoiceNo" value={this.state.InvoiceNo} onChange={this.handleChange1} required />
                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="CompanyName" name="CompanyName" value={this.state.CompanyName} onChange={this.handleChange1} required />
                  </div>
                </div>
                <div >
                  <div >
                    <TextField
                      label="Invoice Details"
                      multiline
                      rows={4} // Set the number of visible rows
                      // value={textValue}
                      // onChange={handleChange}
                      name='Invoicedetails'
                      value={this.state.Invoicedetails} onChange={this.handleChange1}
                      required
                    />

                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="Company Code" name="CompanyCode" value={this.state.CompanyCode} onChange={this.handleChange1} required />
                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="Invoice Amount" name="InvoiceAmount" type='number' value={this.state.InvoiceAmount} onChange={this.handleChange1} required />
                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="Basic Value" name="BasicValue" type='number' value={this.state.BasicValue} onChange={this.handleChange1} required />
                  </div>
                </div>

                <div >
                  <div>

                  </div>
                  <div >
                    <PeoplePicker
                      context={this.props.context}
                      titleText="Select People"
                      personSelectionLimit={3}
                      showtooltip={true}
                      // Use defaultSelectedUsers to set initial selected users
                      defaultSelectedUsers={this.state.Approver}
                      onChange={this.onPeoplePickerChange}
                      ensureUser={true}
                      principalTypes={[PrincipalType.User]}
                      resolveDelay={1000}
                      required
                    />
                  </div>
                </div>
                <div >
                  <div >
                    <Toggle
                      label='IsApproved'
                      id='toggleForApproval'
                      checked={this.state.IsApproved}
                      onText="Yes"
                      offText="No"
                      onChanged={this.handleToggleChange}
                    />
                  </div>
                </div>
                <Dropdown placeholder="Select an option" id='dropDownCapexType' onChange={(event, option) => this.handleDropdownChange(event, option)} options={options} label='Country' selectedKey={this.state.Country} required />
              </div>
            </div>
          </div>
        </div>
        ---------------------------------------------------------------------------------------------------------------------------------
        <PrimaryButton text="Add Row" onClick={this.handleAddRow} />
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>ItemName</th>
              <th>Comments</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record: { Date: any; ItemName: string; ParentID: string; Comments: string; }, index: number) => (
              <tr key={index}>
                <td>

                  <DatePicker
                    value={record.Date}
                    onSelectDate={(date) => this.handleDateChange(date, index, 'Date')}
                    isRequired
                  />
                </td>
                <td>
                  <TextField
                    value={record.ItemName}
                    onChange={(ev, newValue) => this.handleChange(index, 'ItemName', newValue || '')}
                    name={`ItemName_${index}`}
                    required
                  />
                </td>
                <td
                style={{width : '40%'}}>
                  <TextField
                    value={record.Comments}
                    onChange={(ev, newValue) => this.handleChange(index, 'Comments', newValue || '')}
                    multiline
                    rows={2}
                    name={`Comments_${index}`}
                  />
                </td>
                <td
                style={{width: '15%'}}>
                  <DefaultButton text="Delete" onClick={() => this.handleDeleteRow(index)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <DefaultButton text='save' onClick={this.handleSave} /> */}
        <DefaultButton text="Save as Draft" onClick={this.handleDraft} />
        <PrimaryButton text="Submit" onClick={this.handleSubmit} />
        {/* <PrimaryButton text="Submit" onClick={this.handleSave} /> */}

        <PrimaryButton
          style={{ backgroundColor: 'blue' }}
          text="Cancel"
          onClick={() => {
            console.log('State before cancel:', this.state);
            this.setState(
              {
                InvoiceNo: Math.floor(Math.random() * 10000000).toString(),
                CompanyName: '',
                Invoicedetails: '',
                CompanyCode: '',
                InvoiceAmount: NaN,
                BasicValue: NaN,
                Country: '',
                Approver: [],
                IsApproved: false,
                data: [
                  { Date: new Date(), ItemName: '', ParentID: '', Comments: '' },
                  { Date: new Date(), ItemName: '', ParentID: '', Comments: '' }
                ],
              },
              () => {
                console.log('State after cancel:', this.state);
              }
            );
          }}
        />

      </>
    );
  }
}
