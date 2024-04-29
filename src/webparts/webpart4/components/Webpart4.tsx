import * as React from 'react';
import { SPFx, spfi } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
// import "@pnp/sp/items/get";
import type { IWebpart4Props } from './IWebpart4Props';
import type { IWebpart4State } from './IWebpart4State';
import type { IWebpart4Add } from './IWebpart4Add';
import { ComboBox, DefaultButton, DetailsList, IColumn, IComboBox, PrimaryButton, SelectionMode, TextField } from '@fluentui/react';

export default class Webpart4 extends React.Component<IWebpart4Props, IWebpart4State> {
  constructor(props: IWebpart4Props) {
    super(props);

    const columns: IColumn[] = [
      {
        key: 'column1',
        name: 'Title',
        fieldName: 'Title',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: 'column2',
        name: 'LookupJob Title',
        fieldName: 'LookupJob',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          return <span>{item.LookupJob ? item.LookupJob.Title : ''}</span>;
        }
      },
      {
        key: 'column3',
        name: 'LookupJob ProfileJob',
        fieldName: 'LookupJob',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          return <span>{item.LookupJob ? item.LookupJob.ProfileJob : ''}</span>;
        }
      },
      {
        key: 'column4',
        name: 'Actions',
        fieldName: 'Actions',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        onRender: (item) => {
          return (
            <DefaultButton text="Delete" onClick={() => this.handleDelete(item.ID)} />
          );
        }
      },
      {
        key: 'column5',
        name: 'Action1',
        fieldName: 'Action1',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        onRender: (item) => {
          return (
            <PrimaryButton text="Edit" onClick={() => (this.handleEdit(item, item.LookupJobId))} />
          );
        }
      }
    ];


    this.state = {
      ID: '',
      Title: '',
      LookupJob: '',
      data: [],
      lookupOptions: [],
      columns: columns,
    }
  }

  public async componentDidMount(): Promise<void> {
    try {
      await this.getAll();
      await this.getLookupOptions();

    } catch (error) {
      console.log("error in componentDidMount", error);
    }
  }

  public getAll = async () => {
    try {
      const sp: any = spfi().using(SPFx(this.props.context));
      const sp1 = sp.web.lists.getByTitle("List1");
      const items = await sp1.items.select("ID", "Title", "LookupJob/ProfileName", "LookupJob/Title", "LookupJob/ProfileJob", "LookupJob/ProfileId").expand("LookupJob").getAll();

      console.log("Retrieved items:", items); // Log retrieved items for debugging

      this.setState({
        data: items,
      });
    } catch (error) {
      console.log("Error in getAll:", error); // Log error for debugging
    }
  }

  public getLookupOptions = async () => {
    try {
      const sp: any = spfi().using(SPFx(this.props.context));

      // Select the 'ProfileJob' field when fetching items
      const spList: any[] = await sp.web.lists.getByTitle("ProfileList").items.select('ID', 'ProfileJob').getAll();
      let tempCurreny: any[] = [];
      console.log("spList", spList);

      spList.forEach((value: any) => {
        tempCurreny.push({ key: value.ID, text: value.ProfileJob });
      });

      console.log("tempCurreny", tempCurreny);
      this.setState({ lookupOptions: tempCurreny });

    } catch (error) {
      console.log("Error in getLookupOptions:", error);
    }
  }


  public handleSubmit = async (selectedKey: string): Promise<void> => {
    const { Title, LookupJob } = this.state as {
      Title: string,
      LookupJob: {},
    };
    const sp: any = spfi().using(SPFx(this.props.context));

    if (selectedKey) {
      try {
        const item: any = await sp.web.lists.getByTitle("List1").items.add({
          'Title': Title,
          'LookupJobId': parseInt(selectedKey),
        });

        await this.getAll();
        this.setState({ Title: '', LookupJob: '' });
        alert('Added Successfully');
      } catch (error) {
        console.error('Error adding item:', error);
        alert('Failed to add item. Please try again.');
      }
    } else {
      alert('Please select a value for LookupJob');
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value

    this.setState({
      [name]: value,
    } as unknown as Pick<IWebpart4Add, keyof IWebpart4Add>);
  }
  handleChangeLookup = (event: React.FormEvent<IComboBox>, option?: { key: string | number }) => {
    if (option) {
      this.setState({ LookupJob: option.key as string });
    } else {
      this.setState({ LookupJob: ' ' });
    }
  }
  handleDelete = async (Id: React.Key) => {
    try {
      console.log("Deleting item with ID:", Id);
      const sp: any = spfi().using(SPFx(this.props.context));
      const list = sp.web.lists.getByTitle("List1");
      await list.items.getById(Id).delete();
      console.log("Item deleted successfully");
      await this.getAll(); // Refresh the data after deletion
      alert('Item deleted successfully');
    } catch (error) {
      console.error("Error in delete", error);
      alert('Error occurred while deleting item.');
    }
  }

  handleEdit = async (item: any, LookupJobId: number) => {
    // Populate form fields with the selected item's details
    this.setState({
      ID: item.ID,
      Title: item.Title,
      LookupJob: item.LookupJob,
    });
  };

  handleUpdate = async (selectedKey: string): Promise<void> => {
    const { ID, Title, data } = this.state;
    const sp = spfi().using(SPFx(this.props.context));

    // Logging to check if itemId is retrieved correctlya
    console.log("Existing data:", data);
    // const itemId = data.find((item: { Id: number, ProfileId : number}) => item.ProfileId === ProfileId)?.Id;
    const matchingIds = data.filter((item: { ID: React.Key }) => item.ID === ID)
      .map((item: { Id: number }) => item.Id);

    const itemId = matchingIds.length > 0 ? matchingIds[0] : undefined;

    console.log(itemId);
    console.log("Item ID for update:", itemId);

    if (itemId) {
      await sp.web.lists.getByTitle("List1").items.getById(itemId).update({
        'Title': Title,
        'LookupJobId': parseInt(selectedKey),

      });

      // Clear form fields after update
      this.setState({
        Title: '',
        LookupJob: '',
      });

      // Refresh the list data
      await this.getAll();
      alert('Edited Succesfully');
    } else {
      console.error("Item ID not found for update.");
      alert('Something went Wrong');
    }
  };



  public render(): React.ReactElement<IWebpart4Props> {
    return (
      <>
        <div>
          <DetailsList
            items={this.state.data}
            columns={this.state.columns}
            selectionMode={SelectionMode.none}
            getKey={(item) => item.Id} // Assuming there's a unique identifier property like Id
          />
        </div>
        <div>
          <TextField label="Title" name="Title" onChange={this.handleChange} value={this.state.Title} />
          {/* Render ComboBox for LookupJob  */}
          <ComboBox
            label="LookupJob"
            options={this.state.lookupOptions}
            selectedKey={this.state.LookupJob}
            onChange={this.handleChangeLookup}
            data-name="LookupJob" // Add the name property here
          />
          <DefaultButton text="Submit" onClick={() => this.handleSubmit(this.state.LookupJob)} />
          {/* <DefaultButton text="Submit" onClick={() => (this.handleSubmit)} allowDisabledFocus /> */}
          <DefaultButton text="Update" onClick={() => this.handleUpdate(this.state.LookupJob)} allowDisabledFocus />
        </div>
      </>
    );
  }

}