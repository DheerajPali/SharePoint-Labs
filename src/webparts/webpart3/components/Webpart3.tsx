import * as React from 'react';
import { SPFx, spfi } from "@pnp/sp"
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import type { IWebpart3Props } from './IWebpart3Props';
import type { IWebpart3State } from './IWebpart3State';
import { IWebpart3Add } from './Iwebpart3Add';
import "@pnp/sp/fields";
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button'; import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';


export default class IWebpart3 extends React.Component<IWebpart3Props, IWebpart3State> {
  constructor(props: IWebpart3Props) {
    super(props);
    this.state = {
      ID: "",
      ProfileId: 0,
      ProfileName: "",
      ProfileJob: "",
      Choice: "",
      choiceOptions: [],
      data: [], // Initialize data as an empty array
    };

  }


  public async componentDidMount(): Promise<void> {
    try {
      this.getAllItems();
      await this.fetchChoiceOptions(); // Fetch choice options on component mount
    } catch (error) {
      console.log(error)
    }
  }


  public async fetchChoiceOptions(): Promise<void> {
    const sp: any = spfi().using(SPFx(this.props.context));
    const fieldSchema = await sp.web.lists.getByTitle("ProfileList").fields.getByInternalNameOrTitle("Choice")();
    console.log("fieldScema", fieldSchema);
    if (fieldSchema && fieldSchema.Choices) {
      this.setState({ choiceOptions: fieldSchema.Choices });
    }
  }


  public getAllItems = async () => {
    const sp: any = spfi().using(SPFx(this.props.context));
    const ListItems = await sp.web.lists.getByTitle("ProfileList").items.getAll();
    this.setState({
      data: ListItems,
    });

  }


  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value

    this.setState({
      [name]: value,
    } as unknown as Pick<IWebpart3Add, keyof IWebpart3Add>);
  }

  handleChoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    this.setState({
      Choice: value,
    })

  }

  handleDelete = async (Id: number) => {
    const sp: any = spfi().using(SPFx(this.props.context));
    const list = sp.web.lists.getByTitle("ProfileList");
    await list.items.getById(Id).delete();
    await this.getAllItems();
    alert('Deleted Succesfully');
  }

  handleEdit = async (item: any) => {
    // Populate form fields with the selected item's details
    this.setState({
      ID: item.ID,
      ProfileId: item.ProfileId,
      ProfileName: item.ProfileName,
      ProfileJob: item.ProfileJob,
      Choice: item.Choice,
    });
  };

  handleUpdate = async (): Promise<void> => {
    const { ID, ProfileId, ProfileName, ProfileJob, Choice, data } = this.state;
    const sp = spfi().using(SPFx(this.props.context));

    // Logging to check if itemId is retrieved correctlya
    console.log("Existing data:", data);
    // const itemId = data.find((item: { Id: number, ProfileId : number}) => item.ProfileId === ProfileId)?.Id;
    const matchingIds = data
      .filter((item: { ID: React.Key }) => item.ID === ID)
      .map((item: { Id: number }) => item.Id);

    const itemId = matchingIds.length > 0 ? matchingIds[0] : undefined;

    console.log(itemId);
    console.log("Item ID for update:", itemId);

    if (itemId) {
      await sp.web.lists.getByTitle("ProfileList").items.getById(itemId).update({
        ProfileId: ProfileId,
        ProfileName: ProfileName,
        ProfileJob: ProfileJob,
        Choice: Choice,
      });

      // Clear form fields after update
      this.setState({
        ProfileId: 0,
        ProfileName: '',
        ProfileJob: '',
        Choice: '',
      });

      // Refresh the list data
      await this.getAllItems();
      alert('Edited Succesfully');
    } else {
      console.error("Item ID not found for update.");
      alert('Something went Wrong');
    }
  };

  public handleSubmit = async (): Promise<void> => {
    const { ProfileId, ProfileName, ProfileJob, Choice } = this.state as {
      ProfileId: number,
      ProfileName: string,
      ProfileJob: string,
      Choice: string,
    }
    const sp: any = spfi().using(SPFx(this.props.context));


    const item: [] = await sp.web.lists.getByTitle("ProfileList").items.add({
      'ProfileId': ProfileId,
      'ProfileName': ProfileName,
      'ProfileJob': ProfileJob,
      'Choice': Choice,

    });
    await this.getAllItems();
    this.setState({ ProfileId: 0, ProfileName: "", ProfileJob: "", Choice: "" })
    alert('Added Succesfully');

  }


  public render(): React.ReactElement<IWebpart3Props> {
    // const {
    //   description,

    // } = this.props;
    const options: IChoiceGroupOption[] = this.state.choiceOptions.map((option: string) => ({
      key: option,
      text: option,
      value: option,
    }));
    function _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
      console.dir(option);
    }

    return (
      <>
        <div style={{ display: 'flex' }}>
          <div>
            {
              this.state.data.map((item: { ID: React.Key, Id: number, ProfileId: number, ProfileName: string, ProfileJob: string, Choice: string }) => {
                return (
                  <>
                    <div key={item.Id}>
                      
                      <h4>Profile Id : {item.ProfileId}</h4>
                      <h5>ProfileName : {item.ProfileName}</h5>
                      <h5>ProfileJob : {item.ProfileJob}</h5>
                      <h5>Choice : {item.Choice}</h5>

                      {/* <button onClick={() => this.handleEdit(item)}>Edit</button> */}
                      <PrimaryButton text="Edit" onClick={() => (this.handleEdit(item))} />
                      {/* <button onClick={() => (this.handleDelete(item.Id))}>Delete</button> */}
                      <DefaultButton text="Delete" onClick={() => (this.handleDelete(item.Id))} allowDisabledFocus />
                    </div>
                  </>
                )

              })
            }
          </div>
          <div style={{ marginLeft: '100px' }}>
            <div>
              <TextField label="ProfileJob" onChange={this.handleChange} value={this.state.ProfileJob} />

              {/* <label>
                ProfileId
              </label> 
              <input name='ProfileId' onChange={this.handleChange} value={this.state.ProfileId}> 
             </input> */}
            </div>
            <div>
              <TextField label="ProfileName" onChange={this.handleChange} value={this.state.ProfileName} />
              {/* <label>
                ProfileName
              </label>
              <input name='ProfileName' onChange={this.handleChange} value={this.state.ProfileName}>
              </input> */}
            </div>
            <div >
              <TextField label="ProfileId" onChange={this.handleChange} value={this.state.ProfileId.toString()}/>
              {/* <label>
                ProfileJob
              </label>
              <input name='ProfileJob' onChange={this.handleChange} value={this.state.ProfileJob}>
              </input> */}
            </div>

            <div>
              <ChoiceGroup defaultSelectedKey="Choice 1" onChange={this.handleChoiceChange} value={this.state.Choice} options={options} label="Pick one" required={true} />
            </div>
            {/* <div>
              <label>Choice</label>
              <select name='Choice' onChange={this.handleChoiceChange} value={this.state.Choice}>
                <option value="">Select Choice</option>
                {this.state.choiceOptions.map((option: string) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div> */}
             <DefaultButton text="Submit" onClick={() => (this.handleSubmit)} allowDisabledFocus />
             <DefaultButton text="Update" onClick={() => (this.handleUpdate)} allowDisabledFocus />
            {/* <button type='submit' onClick={this.handleSubmit}>Submit</button>
            <button type="button" onClick={this.handleUpdate}>Update</button> */}
          </div>
        </div>

      </>

    );
  }
}
