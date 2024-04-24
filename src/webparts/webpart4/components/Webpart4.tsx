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
import { ComboBox, DefaultButton, IComboBox, TextField } from '@fluentui/react';

export default class Webpart4 extends React.Component<IWebpart4Props, IWebpart4State> {
  constructor(props: IWebpart4Props) {
    super(props);
    this.state = {
      Title: '',
      LookupJob: '',
      data: [],
      lookupOptions: [],
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

      const spList: any[] = await sp.web.lists.getByTitle("List1").items.select("Title", "LookupJob/ProfileName", "LookupJob/Title", "LookupJob/ProfileJob", "LookupJob/ProfileId").expand("LookupJob").getAll();
      let tempCurreny: any[] = [];
      console.log("spList", spList);

      spList.forEach((value: any) => {
        tempCurreny.push({ key: value.Title, text: value.LookupJob.ProfileJob });
    });
    

      console.log("tempCurreny", tempCurreny);
      // const adaniCustomerNames = a.map((item, index) => ({ key: item.adaniCustomerName, value: item.adaniCustomerName }));
      this.setState({ lookupOptions: tempCurreny });

    } catch (error) {
      console.log("Error in getLookupOptions:", error);
    }
  }

  public handleSubmit = async (selectedKey: string): Promise<void> => {
    const { Title, LookupJob } = this.state as {
      Title: string,
      LookupJob: string,
    };
    const sp: any = spfi().using(SPFx(this.props.context));
  
    if (selectedKey) {
      try {
        const item: [] = await sp.web.lists.getByTitle("List1").items.add({
          'Title': Title,
          'LookupJobId': parseInt(selectedKey), // Use the selected key passed from onClick event
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
    } as Pick<IWebpart4Add, keyof IWebpart4Add>);
  }
  handleChangeLookup = (event: React.FormEvent<IComboBox>, option?: { key: string | number }) => {
    if (option) {
      this.setState({ LookupJob: option.key as string });
    } else {
      this.setState({ LookupJob: ' ' });
    }
  }

  public render(): React.ReactElement<IWebpart4Props> {
    return (
      <>
        {
          this.state.data.map((item: any) => {
            return (
              <div key={item.Id}>
                <h4>{item.Title}</h4>
                <h5>{item.LookupJob && item.LookupJob.Title}</h5>
                <h6>{item.LookupJob && item.LookupJob.ProfileName}</h6>
                <h6>{item.LookupJob && item.LookupJob.ProfileJob}</h6>
                <h6>{item.LookupJob && item.LookupJob.ProfileId}</h6>
              </div>
            );
          })
        }
        <div>
          <TextField label="Title" name="Title" onChange={this.handleChange} value={this.state.Title} />
          {/* Render ComboBox for LookupJob */}
          <ComboBox
            label="LookupJob"
            options={this.state.lookupOptions}
            selectedKey={this.state.LookupJob}
            onChange={this.handleChangeLookup}
          />
          <DefaultButton text="Submit" onClick={() => this.handleSubmit(this.state.LookupJob)} />

        </div>
      </>
    );
  }
}