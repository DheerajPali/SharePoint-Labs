import * as React from 'react';
import { IFormWebpartProps } from './IFormWebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
// import styles from './FormWebpart.module.scss';

import { DatePicker, Dropdown, IDropdown, Icon, Label, PrimaryButton, TextField, Toggle } from 'office-ui-fabric-react';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import { IFormWebpartState } from './IFormWebpartState';
import { SPFx, spfi } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { DefaultButton } from '@fluentui/react';
import { IFormWebpartAdd } from './IFormWebpartAdd';

export default class FormWebpart extends React.Component<IFormWebpartProps, IFormWebpartState> {
  constructor(props: IFormWebpartProps) {
    super(props)
    this.state = ({
      ItemName : '',
      // Date : '',
      ParentID : '',
      Comments:'',
      data : [
        1,
      ],
    options:[],      
    })
  }

  public componentDidMount = async() => {
      await this.Options();
  }

  public  handleAdd = async() =>{
    try {
      const abc:any[] = [...this.state.data,1]
      this.setState({
        data : abc,
      })
      // const sp: any = spfi().using(SPFx(this.props.context));
    } catch (error) {
      console.log("handleAdd ::",error );
    }
  }
  public handleSubmit = async (selectedKey: string): Promise<void> => {
    try {
        const{ItemName,ParentID,Comments} = this.state as {
          ItemName: string,
          ParentID: string,
          Comments : string,
          // Date:string,
        };
        const sp:any = spfi().using(SPFx(this.props.context));
        if(selectedKey){
        const listItem : any = await sp.web.lists.getByTitle("ChildList").items.add({
          'ItemName' : ItemName,
          // Date : Date,
          'ParentIDId' : parseInt(selectedKey),
          'Comments':Comments,
          // 'Date':Date.toString(),
        })}
        this.setState({ ItemName: '', Comments: '',ParentID: ''});
    
    } catch (error) {
      console.log("handlesubmit::error",error);
    }
    
  }
  
  public Options = async() =>{
    try {
      const sp:any = spfi().using(SPFx(this.props.context));
      const listItem : any[] = await sp.web.lists.getByTitle("InvoiceDetails").items.select("ID").getAll();

      // const spList: any[] = await sp.web.lists.getByTitle("ProfileList").items.select('ID', 'ProfileJob').getAll();
      let tempOptions: any[] = [];
      console.log("listItem", listItem);

      listItem.forEach((value: any) => {
        tempOptions.push({ key: value.ID, text: value.ID.toString() });
      });
      console.log("tempOptions", tempOptions);
      this.setState({ options: tempOptions });
    } catch (error) {
      console.log("Options::Error:",error);
    }
  }
  
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value

    this.setState({
      [name]: value,
    } as Pick<IFormWebpartAdd, keyof IFormWebpartAdd>);
  }

  
  handleChangeLookup = (event: React.FormEvent<HTMLDivElement>, option?: { key: string | number }) => {
    if (option) {
      this.setState({ ParentID: option.key as string });
    } else {
      this.setState({ ParentID: '' });
    }
  }
  // handleDateChange = (date:any) => {
  //   // Update the Date state with the selected date
  //   this.setState({
  //     Date: date.toISOString().substring(0, 10) // Store date as YYYY-MM-DD string
  //   });
  // }


  // public handleAdd = () => {
  //   const nextId = this.state.data.length + 1;
  //   const newDataEntry = {
  //     id: nextId,
  //     ItemName: '',
  //     Date: '',
  //     ParentId: '',
  //     Comments: ''
  //   };
  //   this.setState(prevState => ({
  //     data: [...prevState.data, newDataEntry]
  //   }));
  // };
  

  public render(): React.ReactElement<IFormWebpartProps> {
    const customOptions = [
      { key: 'option1', text: 'India' },
      { key: 'option2', text: 'Australia' },
      { key: 'option3', text: 'USA' }
    ];

  //   const [status, setStatus] = React.useState<string>("");

  // const handleStatusChange = (newStatus: string) => {
  //   setStatus(newStatus);
  // };
  // console.log(status);
  // const { Date } = this.state;
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

        ----------------------------------------------------------------------------------------------------------------------------------
        {/* This is Second Section */}
        <PrimaryButton
                            text="Add"
                            allowDisabledFocus
                            // onClick={this.state.data.add(1)}
                            onClick={this.handleAdd}
                            // iconProps={addPlus}
                          />
        <thead>
          <tr>
            <th style={{ width: '25%' }}>Date</th>
            <th style={{ width: '20%' }}>ItemName</th>
            <th style={{ width: '15%' }}>ParentId</th>
            <th style={{ width: '25%' }}>Comment</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map((item:any, index :React.Key) => (
            <tr id={`add${index}`} key={index}>
              <td>
                {/* <DatePicker
                  className="customDatePicker"
                  value={this.state.Date.toString()}
                // onSelectDate={this.dateChangeEventHandlerSupplierQuoteDetails(  idx )  }

                // disabled={this.state.isDisplayMode}
                /> */}
                <DatePicker
                  className="customDatePicker"
                />
              </td>
              <td>
                <TextField
                  value={this.state.ItemName}
                  onChange={this.handleChange}
                // onChange={this.handleChange( idx )}
                // disabled={this.state.isDisplayMode}
                name="ItemName"
                />
              </td>
              <td>
                {/* <Dropdown placeholder="Select an option" id='dropDownCurrency' onChange={this.dropDownChangeEventHandlerSupplierQuoteDetails(idx)} options={item.currencyForVendor} selectedKey={item.currencyForVendorID} disabled={this.state.isDisplayMode} /> */}
                <Dropdown placeholder="Select an option" options={this.state.options} selectedKey={this.state.ParentID}  onChange={this.handleChangeLookup} 
                data-name="ParentID"/>

              </td>
              <td>
                <TextField
                      multiline
                      rows={2} // Set the number of visible rows
                      value={this.state.Comments}
                      // onChange={handleChange}
                      data-name='Comments'
                      onChange={this.handleChange}
                      name="Comments"
                  />
              </td>
            </tr>
           ))} 
        </tbody>

        <DefaultButton style={{width:"20%"}} text='Save As Draft'onClick={() => this.handleSubmit(this.state.ParentID)} />
        <PrimaryButton style={{width:"20%",backgroundColor:'gray'}} text='Submit' onClick={() => this.handleSubmit(this.state.ParentID)} />
        <PrimaryButton style={{width:"20%",backgroundColor:'blue'}} text='Cancel' onClick={()=>{
          this.setState({
            ItemName : '',
            // Date : '',
            ParentID : '',
            Comments:'',
            data : [
              1,
            ],
          })
        }}/>
      </>
    );
  }
}
