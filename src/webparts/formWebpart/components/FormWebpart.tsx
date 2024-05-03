import * as React from 'react';
import { IFormWebpartProps } from './IFormWebpartProps';
import { DefaultButton, PrimaryButton, TextField, Dropdown, DatePicker, Label, Toggle } from 'office-ui-fabric-react';
import {spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { PeoplePicker,PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';

export default class FormWebpart extends React.Component<IFormWebpartProps, any> {
  private spContext: any; // Declare a variable to hold SharePoint context

  constructor(props: IFormWebpartProps) {
    super(props);
    this.state = {
      ItemName: '',
      Comments: '',
      ParentID: '',
      Status: '',
      data: [{ ItemName: '', ParentID: '', Comments: '' },
      { ItemName: '', ParentID: '', Comments: '' }
      ],
      options: [],
    };
  }


  
  public componentDidMount = async () => {
    await this.loadOptions();
  }

  //this method is created to fetch all the available options using lookup from InvoiceDetails9(Parent list )
  private loadOptions = async () => {
    try {
      const sp: any = spfi().using(SPFx(this.props.context));
      const items = await sp.web.lists.getByTitle("InvoiceDetails").items.select("ID").getAll();
      const options = items.map((item: any) => ({ key: item.ID, text: item.ID.toString() }));
      this.setState({ options });
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

  // handleChangeLookup = (event: React.FormEvent<HTMLDivElement>, option?: { key: string | number }) => {
  //   if (option) {
  //     this.setState({ Lookup: option.key as string });
  //   } else {
  //     this.setState({ Lookup: '' });
  //   }
  // }


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
  private handleSave = async () => {
    const { data } = this.state;
    try {
      const sp: any = spfi().using(SPFx(this.props.context));
      const list = sp.web.lists.getByTitle("ChildList");
      for (const record of data) {
        await list.items.add({
          ItemName: record.ItemName,
          ParentIDId: parseInt(record.ParentID),
          Comments: record.Comments,
          Status: this.state.Status,
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
  public handleDraft = () =>{
    this.state =({
      ...this.state,
     Status : 'Draft',
    })
     this.handleSave();
   }

   //This method will update status as Submit
   public handleSubmit1 = () =>{
    this.state =({
      ...this.state,
     Status : 'Submit',
    })
    this.handleSave();
   }

   
  public render(): React.ReactElement<IFormWebpartProps> {
    const { data } = this.state;
    const customOptions = [
      { key: 'option1', text: 'India' },
      { key: 'option2', text: 'Australia' },
      { key: 'option3', text: 'USA' }
    ];

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
                    {/* <TextField label="ItemName" name="ItemName" onChange={this.handleChange} value={this.state.Invoice} /> */}
                    <TextField label="Invoice No " name="InvoiceNo" value={(Math.random() * 10000).toString()} />
                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="CompanyName" name="CompanyName" />
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
                      data-name='Invoicedetails'
                    />

                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="Company Code" name="CompanyCode" />
                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="Invoice Amount" name="InvoiceAmount" type='number' />
                  </div>
                </div>
                <div >
                  <div >
                    <TextField label="Basic Value" name="BasicValue" type='number' />
                  </div>
                </div>

                <div >
                  <div>
                    <label>Approver</label>
                  </div>
                  <div >
                    <PeoplePicker
                      context={this.props.context}
                      placeholder='Add approvers'
                      ensureUser={true}
                      personSelectionLimit={3}
                      groupName=''
                      showtooltip={false}
                      disabled={false}
                      resolveDelay={1000}
                      principalTypes={[PrincipalType.User]}
                    >
                    </PeoplePicker>
                  </div>

                </div>
                <div >
                  <div >

                    {/* <Toggle id='toggleForImplication' defaultChecked={false} onText="Yes" offText="No" onChange={this.toggleChangeHandler} checked={this.state.capexRegisterDetails.isImplication} disabled={this.state.isDisplayMode} /> */}

                    <Label className='customLabel'>Is Approved</Label>
                    <Toggle id='toggleForImplication' defaultChecked={false} onText="Yes" offText="No" />
                    {/* <TextField label="Is Approved" name="IsApproved"   /> */}
                  </div>
                </div>
                {/* <Dropdown placeholder="Select an option" id='dropDownCapexType' onChange={this.dropdownChangedEventHandler} options={this.state.capexRegisterDetails.capexType} selectedKey={this.state.capexTypeId} disabled={this.state.isDisplayMode} errorMessage={this.state.validation.validationErrorCapexType} />             */}
                <Dropdown placeholder="Select an option" id='dropDownCapexType' options={customOptions} label='Country' />
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
              <th>ParentId</th>
              <th>Comments</th>
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
                    name={`ItemName_${index}`} // Unique name for ItemName field
                  />
                </td>
                <td>
                  {/* <Dropdown
                    placeholder="Select an option"
                    options={this.state.options}
                    selectedKey={record.ParentID}
                    onChange={(ev, option) => this.handleChange(index, 'ParentID', option?.key.toString() || '')}
                    // onChange={(ev, option) => this.handleChange(index, 'ParentID',option)}
                    data-name={`ParentID_${index}`} // Unique name for ParentID field
                  /> */}
                  <Dropdown
                    placeholder="Select an option"
                    options={this.state.options}
                    selectedKey={record.ParentID.toString()} // Ensure ParentID is converted to string
                    onChange={(ev, option) => this.handleChangeLookup(index, 'ParentID', option?.key.toString() || '')} // Convert option?.key to string
                    data-name={`ParentID_${index}`} // Unique name for ParentID field
                  />
                </td>
                <td>
                  <TextField
                    value={record.Comments}
                    onChange={(ev, newValue) => this.handleChange(index, 'Comments', newValue || '')}
                    multiline
                    rows={2}
                    name={`Comments_${index}`} // Unique name for Comments field
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

     
        <DefaultButton text="Save as Draft" onClick={this.handleDraft} />
        <PrimaryButton text="Submit" onClick={this.handleSubmit1} />
        <PrimaryButton style={{backgroundColor: 'blue'}} text="Cancel" onClick={()=>{
          this.setState({
            ItemName : '',
            Date : '',
            ParentId : '',
            Comments:'',
            data: [{ ItemName: '', ParentID: '', Comments: '' },
            { ItemName: '', ParentID: '', Comments: '' }
            ]
          })
        }} />
      </>
    );
  }
}
