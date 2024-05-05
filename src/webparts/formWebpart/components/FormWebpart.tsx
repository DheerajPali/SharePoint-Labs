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

export default class FormWebpart extends React.Component<IFormWebpartProps, any> {
  constructor(props: IFormWebpartProps) {
    super(props);
    const a = Math.random() * 1000
    this.state = {
      ItemName: '',
      Comments: '',
      ParentID: '',
      Status: '',
      data: [{ ItemName: '', ParentID: '', Comments: '' },
      { ItemName: '', ParentID: '', Comments: '' }
      ],
      options: [],


      InvoiceNo: Math.floor(Math.random() * 1000000).toString(),
      CompanyName: '',
      Invoicedetails: '',
      CompanyCode: '',
      InvoiceAmount: NaN,
      BasicValue: NaN,
      User: '',
      IsApproved: false,
      Country: '',
      CountryOptions: [],
      data1: [],
    };
  }

  public componentDidMount = async () => {
    await this.loadOptions();
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

  //this method is created to fetch all the available options using lookup from InvoiceDetails9(Parent list )
  private loadOptions = async () => {
    try {
      const sp: any = spfi().using(SPFx(this.props.context));
      const items: any[] = await sp.web.lists.getByTitle("InvoiceDetails").items.select("ID").getAll();
      let tempOptions: any[] = [];

      items.forEach((item: any) => {
        tempOptions.push({ key: item.ID, text: item.ID.toString() });
      });
      this.setState({
        options: tempOptions,
      })
    } catch (error) {
      console.log('Error loading options:', error);
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
    data.push({ ItemName: '', ParentID: '', Comments: '' });
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
        await list.items.add({
          ItemName: record.ItemName,
          ParentIDId: parseInt(itemId),
          Comments: record.Comments,
          Status: statusValue,
        });
      }
      // here we're clearing all the filled data after submission.
      this.setState({
        ItemName: '',
        Comments: '',
        ParentID: '',
        Status: '',
        data: [{ ItemName: '', ParentID: '', Comments: '' },
        { ItemName: '', ParentID: '', Comments: '' }
        ],
      });
    } catch (error) {
      console.log('Error saving records:', error);
    }
  }

  //This method will update status as Draft

  public handleDraft = (): void => {
      const status = "Draft"
      this.handleAdd(this.state.User,status); // Call handleAdd after setting the status to 'Draft'
  };

  public handleSubmit = (): void => {
      const status = "Submit"
      this.handleAdd(this.state.User,status); // Call handleAdd after setting the status to 'Submit'
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

  private handlePeoplePickerChange = (selectedItems: any[]) => {
    if (selectedItems.length > 0) {
      this.setState({
        User: selectedItems[0], // Assuming you want to select only one person
      });
    } else {
      this.setState({
        User: null,
      });
    }
  };

  private handleToggleChange = (checked: boolean) => {
    this.setState({ IsApproved: checked });
  };

  handleAdd = async (selectectedPerson: any , status : string): Promise<void> => {
    const { InvoiceNo, CompanyName, Invoicedetails, CompanyCode, InvoiceAmount, BasicValue, Country,
      User, IsApproved
    } = this.state as {
      InvoiceNo: string;
      CompanyName: string;
      Invoicedetails: string;
      CompanyCode: string;
      InvoiceAmount: number;
      BasicValue: number;
      User: string,
      Country: string;
      IsApproved: boolean,
    }

    const sp: any = spfi().using(SPFx(this.props.context));
    try {
      const user = selectectedPerson.id;
      const list = await sp.web.lists.getByTitle("InvoiceDetails").items.add({
        'InvoiceNo': InvoiceNo,
        'CompanyName': CompanyName,
        'Invoicedetails': Invoicedetails,
        'CompanyCode': CompanyCode,
        'InvoiceAmount': InvoiceAmount,
        'BasicValue': BasicValue,
        'Country': Country,
        'UserId': parseInt(user),
        'IsApproved': IsApproved
      });
      const addedItemId = list.data.Id;
      this.setState({ InvoiceNo: Math.floor(Math.random() * 10000000).toString(), CompanyName: '', Invoicedetails: '', CompanyCode: '', InvoiceAmount: NaN, BasicValue: NaN, Country: '', User: '', IsApproved: false });
      // this.handleSubmit(addedItemId);
      const statusValue = status.toString();
      await this.handleSave(addedItemId ,statusValue);
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
                <div id='id_customform'>
                </div>
                <div >
                  <div >
                    <TextField label="Invoice No " name="InvoiceNo" value={this.state.InvoiceNo} onChange={this.handleChange1} />
                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="CompanyName" name="CompanyName" value={this.state.CompanyName} onChange={this.handleChange1} />
                  </div>
                </div>
                <div >
                  <div >
                    {/* <TextField label="Invoice details" name="Invoicedetails"   /> */}
                    {/* <label>Invoice Details</label> */}
                    {/* <textarea name="Invoicedetails" /> */}
                    <TextField
                      label="Invoice Details"
                      multiline
                      rows={4} // Set the number of visible rows
                      // value={textValue}
                      // onChange={handleChange}
                      name='Invoicedetails'
                      value={this.state.Invoicedetails} onChange={this.handleChange1}
                    />

                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="Company Code" name="CompanyCode" value={this.state.CompanyCode} onChange={this.handleChange1} />
                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="Invoice Amount" name="InvoiceAmount" type='number' value={this.state.InvoiceAmount} onChange={this.handleChange1} />
                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="Basic Value" name="BasicValue" type='number' value={this.state.BasicValue} onChange={this.handleChange1} />
                  </div>
                </div>

                <div >
                  <div>

                  </div>
                  <div >
                    <PeoplePicker
                      context={this.props.context}
                      titleText="Approver"
                      personSelectionLimit={3}
                      showtooltip={true}
                      // Use defaultSelectedUsers to set initial selected users
                      defaultSelectedUsers={[this.state.User]}
                      onChange={this.handlePeoplePickerChange}
                      ensureUser={true}
                      principalTypes={[PrincipalType.User]}
                      resolveDelay={1000}
                    />
                  </div>
                </div>
                <div >
                  <div >

                    {/* <Toggle id='toggleForImplication' defaultChecked={false} onText="Yes" offText="No" onChange={this.toggleChangeHandler} checked={this.state.capexRegisterDetails.isImplication} disabled={this.state.isDisplayMode} /> */}

                    {/* <Label className='customLabel'>Is Approved</Label> */}
                    {/* <Toggle id='toggleForImplication' defaultChecked={false} onText="Yes" offText="No" /> */}
                    {/* <TextField label="Is Approved" name="IsApproved"   /> */}
                    <Toggle
                      label='IsApproved'
                      id='toggleForApproval'
                      defaultChecked={this.state.IsApproved}
                      onText="Yes"
                      offText="No"
                      onChanged={this.handleToggleChange}
                    />
                  </div>
                </div>
                {/* <Dropdown placeholder="Select an option" id='dropDownCapexType' onChange={this.dropdownChangedEventHandler} options={this.state.capexRegisterDetails.capexType} selectedKey={this.state.capexTypeId} disabled={this.state.isDisplayMode} errorMessage={this.state.validation.validationErrorCapexType} />             */}

                <Dropdown placeholder="Select an option" id='dropDownCapexType' onChange={(event, option) => this.handleDropdownChange(event, option)} options={options} label='Country' selectedKey={data.Country} />
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
              {/* <th>ParentId</th> */}
              <th>Comments</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record: { ItemName: string; ParentID: string; Comments: string; }, index: number) => (
              <tr key={index}>
                <td>
                  {/* <DatePicker
                    onSelectDate={(date) => this.handleChange(index, 'date', date.toISOString())}
                  /> */}
                </td>
                <td>
                  <TextField
                    value={record.ItemName}
                    onChange={(ev, newValue) => this.handleChange(index, 'ItemName', newValue || '')}
                    name={`ItemName_${index}`}
                  />
                </td>
                {/* <td>
                  <Dropdown
                    placeholder="Select an option"
                    options={this.state.options}
                    selectedKey={record.ParentID.toString()}
                    onChange={(ev, option) => this.handleChangeLookup(index, 'ParentID', option?.key.toString() || '')}
                    data-name={`ParentID_${index}`}
                  />
                </td> */}
                <td>
                  <TextField
                    value={record.Comments}
                    onChange={(ev, newValue) => this.handleChange(index, 'Comments', newValue || '')}
                    multiline
                    rows={2}
                    name={`Comments_${index}`}
                  />
                </td>
                <td>
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
        <PrimaryButton style={{ backgroundColor: 'blue' }} text="Cancel" onClick={() => {
          this.setState({
            ItemName: '',
            Date: '',
            ParentId: '',
            Comments: '',
            data: [{ ItemName: '', ParentID: '', Comments: '' },
            { ItemName: '', ParentID: '', Comments: '' }
            ]
          })
        }} />
      </>
    );
  }
}
