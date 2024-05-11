import * as React from 'react';
import { IFormWebpartProps } from './IFormWebpartProps';
import { DefaultButton, PrimaryButton, TextField, Dropdown, DatePicker, Label, Toggle, IChoiceGroupOption, IDropdownOption } from 'office-ui-fabric-react';
import { spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/fields";
import "@pnp/sp/attachments"
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import { IFolder } from "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import { IFormWebpartAdd } from './IFormWebpartAdd';
import { Field } from '@pnp/sp/fields';
import { IFormWebpartState } from './IFormWebpartState';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react';
// import { IFormWebpartState, IWebpart7State } from './IFormWebpartState';

export default class FormWebpart extends React.Component<IFormWebpartProps, IFormWebpartState> {
  constructor(props: IFormWebpartProps) {
    super(props);
    //here we are setting default state.
    this.state = {
      ItemName: '',
      Comments: '',
      ParentID: '',
      Date: new Date(),
      Status: '',
      data: [{ Date: new Date(), ItemName: '', ParentID: '', Comments: '', Document: [] },
      { Date: new Date(), ItemName: '', ParentID: '', Comments: '', Document: [] }
      ],
      options: [],
      Document: [],

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
      ItemID: '',
    };
  }

  public componentDidMount = async () => {
    await this.fetchChoiceOptions();
  }

  //this method is created to fetch the choice options inside a field. 
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
  //Now we're not using this method, because we're taking Id by default.
  private handleChangeLookup = (index: number, fieldName: string, value: string) => {
    const { data } = this.state;
    data[index][fieldName] = value;
    this.setState({ data });
  }

  //this method will add another blank row with given properties in your webpart
  private handleAddRow = () => {
    const { data } = this.state;
    data.push({ Date: new Date(), ItemName: '', ParentID: '', Comments: '', Document: [] });
    this.setState({ data });
  }

  //this method will add your state data by fetching each record in your ChildList.
  private handleSave = async (itemId: any, status: string) => {
    const { data } = this.state;

    try {
      const sp: any = spfi().using(SPFx(this.props.context));
      const list = sp.web.lists.getByTitle("ChildList");
      const statusValue = status.toString();
      for (const record of data) {

        const addedItem = await list.items.add({
          Date: record.Date,
          ItemName: record.ItemName,
          ParentIDId: parseInt(itemId),
          Comments: record.Comments,
          Status: statusValue
        });
        const addedItemId = addedItem.data.Id;
        this.setState({
          ItemID: addedItemId.toString(),
        })
        // });
        const docs = record.Document;
        for (let i = 0; i < docs.length; i++) {
          const { ItemID } = this.state as {
            ItemID: string,
          };

          let fileContent = await docs[i].downloadFileContent();
          const sp: any = spfi().using(SPFx(this.props.context));
          let addedItem: any = await sp.web.getFolderByServerRelativePath('DocLibrary1').files.addUsingPath(docs[i].fileName, fileContent, { Overwrite: true });
          let item = await addedItem.file.getItem();
          // Set the lookup column value
          await item.update({
            'ItemIDId': Number(ItemID)

          });
          // let savefile: IFolder = await sp.web.getFolderByServerRelativePath('DocLibrary1').files.addUsingPath(docs[i].fileName, fileContent, { Overwrite: true });
        }
        this.setState({ Document: [] });
        alert('File added successfully')
      }

      this.setState({
        data: [{ Date: new Date(), ItemName: '', ParentID: '', Comments: '' },
        { Date: new Date(), ItemName: '', ParentID: '', Comments: '' }
        ],
      });
    } catch (error) {
      console.log('Error saving records:', error);
    }
  }

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
    } as unknown as Pick<IFormWebpartAdd, keyof IFormWebpartAdd>);
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

  public getSelectedFile = async (result: any, index: number) => {
    const newData = [...this.state.data];
    newData[index].Document = result; // Store selected file in Document field
    this.setState({ data: newData });
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
                    <TextField label="Invoice Amount" name="InvoiceAmount" type='number' value={this.state.InvoiceAmount.toString()} onChange={this.handleChange1} required />
                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="Basic Value" name="BasicValue" type='number' value={this.state.BasicValue.toString()} onChange={this.handleChange1} required />
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
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {/* here we're creating a record for each index */}
            {data.map((record: { Date: any; ItemName: string; ParentID: string; Comments: string; Document: any }, index: number) => (
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
                  style={{ width: '40%' }}>
                  <TextField
                    value={record.Comments}
                    onChange={(ev, newValue) => this.handleChange(index, 'Comments', newValue || '')}
                    multiline
                    rows={2}
                    name={`Comments_${index}`}
                  />
                </td>
                <td
                  style={{ width: '15%' }}>
                  {/* This button deletes single row */}
                  <DefaultButton text="Delete" onClick={() => this.handleDeleteRow(index)} />
                </td>
                <td>
                  <FilePicker
                    buttonLabel="Attachment"
                    buttonIcon="Attach"
                    onSave={(result) => this.getSelectedFile(result, index)}
                    onChange={(result) => this.getSelectedFile(result, index)}
                    context={this.props.context}
                    hideLinkUploadTab={true}
                    hideOneDriveTab={true}
                    hideStockImages={true}
                    hideLocalUploadTab={true}
                    hideSiteFilesTab={true}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Save as Draft button workflow --> handleAdd(status) :: handleSave(addedItemId, statusValue) */}
        <DefaultButton text="Save as Draft" onClick={() => this.handleAdd('Draft')} />

        {/* Submit button workflow --> handleAdd(status) :: handleSave(addedItemId, statusValue) */}
        <PrimaryButton text="Submit" onClick={() => this.handleAdd('Submit')} />
        {/* <DefaultButton text='test' onClick={() => this.handleSave(1, 'try')} /> */}

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
                  { Date: new Date(), ItemName: '', ParentID: '', Comments: '', Document: null },
                  { Date: new Date(), ItemName: '', ParentID: '', Comments: '', Document: null }
                ],
              },

              //Here you can verify ,wether your state is empty after clicking on Cancel button or not. 
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
