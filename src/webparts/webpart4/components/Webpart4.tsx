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
    ];
    

    this.state = {
      Title: '',
      LookupJob:'',
      data: [],
      lookupOptions: [],
      columns : columns,
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
      const items = await sp1.items.select("Title", "LookupJob/ProfileName", "LookupJob/Title", "LookupJob/ProfileJob", "LookupJob/ProfileId").expand("LookupJob").getAll();

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
      const spList: any[] = await sp.web.lists.getByTitle("ProfileList").items.select('ID','ProfileJob').getAll();
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
  handleDelete = async (Id:number) => {
    try{
      const sp: any = spfi().using(SPFx(this.props.context));
      const list = sp.web.lists.getByTitle("List1");
    await list.items.getById(Id).delete();
      // const sp1 = sp.web.lists.getByTitle("List1");
      // // const a = await items.getById(item.ID);
      // await sp1.items.getById(Id).delete();
      // b.delete();
    }
    catch(error){
      console.log("Error in delete",error);
      alert('Error occured.')
    }
  }

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
        <DefaultButton  text="Submit" onClick={() => this.handleSubmit(this.state.LookupJob)} />
      </div>
    </>
  );
}

}