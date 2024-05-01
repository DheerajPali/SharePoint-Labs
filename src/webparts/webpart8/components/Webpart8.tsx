import * as React from 'react';
import type { IWebpart8Props } from './IWebpart8Props';
import { SPFx, spfi } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { IWebpart8State } from './IWebpart8State';
import { ComboBox, DatePicker, DefaultButton, DetailsList, IColumn, IComboBox, SelectionMode, TextField } from 'office-ui-fabric-react';
import { IWebpart8Add } from './IWebpart8Add';
import { PrimaryButton } from '@fluentui/react';


export default class Webpart8 extends React.Component<IWebpart8Props, IWebpart8State> {

  constructor(props: IWebpart8Props) {
    super(props)
    const columns: IColumn[] = [
      {
        key: 'column1',
        name: 'item Name',
        fieldName: 'ItemName',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: 'column2',
        name: 'Date',
        fieldName: 'Date',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: 'column3',
        name: 'Comments',
        fieldName: 'Comments',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: 'column4',
        name: 'ParentId',
        fieldName: 'ParentID',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          return <span>{item.ParentID ? item.ParentID.ID : ''}</span>;
        }
      },
      {
        key: 'column5',
        name: 'Edit',
        fieldName: 'Edit',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        onRender: (item) => {
          return (
            <PrimaryButton text="Edit" onClick={() => (this.handleEdit(item, item.ParentIDId))} />
          );
        }
      }
    ];

    this.state = ({
      ID : '',
      ItemName: '',
      Date: '',
      Comments: '',
      ParentID: '',
      Status: '',
      data: [],
      columns: columns,
      lookupOptions: [],
    })
  }

  public async componentDidMount() {
    await this.getAll();
    await this.getLookupOptions();

  }

  public getLookupOptions = async () => {

    const sp: any = spfi().using(SPFx(this.props.context));
    const InvoiceDetailsListData = await sp.web.lists.getByTitle("InvoiceDetails").items.select("ID").getAll();
    const tempOptions: any[] = []
    console.log("InvoiceDetailstdata", InvoiceDetailsListData);

    if (InvoiceDetailsListData.length > 0) {
      InvoiceDetailsListData.forEach((value: any) => {
        tempOptions.push({ key: value.ID, text: value.ID });
      });
      try {
        this.setState({
          lookupOptions: tempOptions,
        })
      } catch (error) {
        console.log("getAllItems :: Error : ", error);
      }
    }
    else {
      alert('Not getting Lookup options');
    }
  }


  public getAll = async () => {
    try {
      const sp = spfi().using(SPFx(this.props.context))
      const allData = await sp.web.lists.getByTitle("ChildList").items.select("ID","ItemName", "ParentID/ID", "Date", "Comments", "Status").expand("ParentID").getAll();

      this.setState({
        data: allData
      })

    } catch (error) {
      console.log("error", error);
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value
    this.setState({
      [name]: value,
    } as unknown as Pick<IWebpart8Add, keyof IWebpart8Add>);
  }
  handleChangeLookup = (event: React.FormEvent<IComboBox>, option?: { key: string | number }) => {
    if (option) {
      this.setState({ ParentID: option.key as string });
    } else {
      this.setState({ ParentID: '' });
    }
  }


  public handleSubmit = async (selectedKey: string): Promise<void> => {
    const { ItemName, Date, Comments } = this.state as {
      ItemName: string,
      Date: string,
      Comments: string,
    };
    const sp: any = spfi().using(SPFx(this.props.context));

    if (selectedKey) {
      try {
        const item: any = await sp.web.lists.getByTitle("ChildList").items.add({
          // 'ItemName': ItemName,
          // 'Comments': Comments,
          // 'ParentIDId': parseInt(selectedKey),
          'ItemName': '',
          'Comments': '',
          'ParentIDId': NaN,
          'Date': NaN,
        });

        await this.getAll();
        this.setState({ ItemName: '', ParentID: '', Date: '', Comments: '' });
        alert('Added Successfully');
      } catch (error) {
        console.error('Error adding item:', error);
        alert('Failed to add item. Please try again.');
      }
    } else {
      alert('Please select a value for LookupJob');
    }
  }

  handleEdit = async (item: any, ParentIDId: number) => {
    // Populate form fields with the selected item's details
    console.log("item.ParentID",item.ParentID);
    console.log("item",item);
    const selectedLookupJob = item.ParentID?.ID;
    this.setState({
      ItemName : item.ItemName,
      Date: item.Date,
      ParentID: selectedLookupJob,
    });
  };

  
  handleUpdate = async (selectedKey: string, Id : number): Promise<void> => {
    const { ItemName, Date,Comments, data } = this.state;
    const sp = spfi().using(SPFx(this.props.context));

    // Logging to check if itemId is retrieved correctlya
    console.log("Existing data:", data);
    // const itemId = data.find((item: { Id: number, ProfileId : number}) => item.ProfileId === ProfileId)?.Id;

    console.log(selectedKey);
    console.log("Item ID for update:", selectedKey);

    if (selectedKey) {
      await sp.web.lists.getByTitle("List1").items.getById(Id).update({
        'ItemName': ItemName,
        'Date': Date,
        'Comments' : Comments,
        'ParentIDId': parseInt(selectedKey),
      });

      // Clear form fields after update
      this.setState({
        ItemName: '',
        Date: '',
        Comments:''
      });

      // Refresh the list data
      await this.getAll();
      alert('Edited Succesfully');
    } else {
      console.error("Item ID not found for update.");
      alert('Something went Wrong');
    }
  };


  public handleSubmit1 = async (): Promise<void> => {
    const { ItemName, Date, Comments } = this.state as {
      ItemName: string,
      Date: string,
      Comments: string,
    };
    const sp: any = spfi().using(SPFx(this.props.context));

    try {
      const item: any = await sp.web.lists.getByTitle("ChildList").items.add({
        // 'ItemName': ItemName,
        // 'Comments': Comments,
        // 'ParentIDId': parseInt(selectedKey),
        'ItemName': '',
        'Comments': '',
        'ParentIDId': NaN,
        'Date': NaN,
      });

      await this.getAll();
      this.setState({ ItemName: '', ParentID: '', Date: '', Comments: '' });
      alert('Added Successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }

  }

  public render(): React.ReactElement<IWebpart8Props> {


    return (
      <>
        <DetailsList
          items={this.state.data}
          columns={this.state.columns}
          selectionMode={SelectionMode.none}
          getKey={(item) => item.Id} // Assuming there's a unique identifier property like Id
        />
        {/* <div style={{display:'flex'}}>

        </div>
        <TextField label="ItemName" name="ItemName" onChange={this.handleChange} value={this.state.ItemName} />
        <TextField label="Date" name="Date" onChange={this.handleChange} value={this.state.Date} />
        <TextField label="Comments" name="Comments" onChange={this.handleChange} value={this.state.Comments} />
        <ComboBox
            label="ParentID"
            options={this.state.lookupOptions}
            selectedKey={this.state.ParentID}
            onChange={this.handleChangeLookup}
            data-name="ParentID" // Add the name property here
          /> */}
        {/* <DefaultButton text="Submit" onClick={() => this.handleSubmit(this.state.ParentID)} /> */}
        <DefaultButton text="Add" onClick={this.handleSubmit1} />
      </>
    );
  }
}
