import * as React from 'react';
import {SPFx, spfi} from "@pnp/sp"
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import type { IWebpart3Props } from './IWebpart3Props';
import type { IWebpart3State } from './IWebpart3State';
import { IWebpart3Add } from './Iwebpart3Add';
import "@pnp/sp/fields";

export default class Webpart3 extends React.Component<IWebpart3Props,IWebpart3State> {

  constructor (props:IWebpart3Props){
    super(props);
    this.state = {
      ProfileId : 0,
      ProfileName : "",
      ProfileJob : "",
      Choice : "",
      choiceOptions: [],
      data : [],
    }
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
    console.log("fieldScema",fieldSchema);
    if (fieldSchema && fieldSchema.Choices) {
      this.setState({ choiceOptions: fieldSchema.Choices });
    }
  }


  public getAllItems = async () =>{
    const sp : any = spfi().using(SPFx(this.props.context));
    const ListItems = await sp.web.lists.getByTitle("ProfileList").items.getAll();
    this.setState({
      data :ListItems,
    })
  }


  handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value

    this.setState({
      [name]: value,
    } as unknown as Pick <IWebpart3Add, keyof IWebpart3Add>);
  }

  handleChoiceChange = (event : React.ChangeEvent<HTMLSelectElement>) =>{
    const value = event.target.value;
    this.setState({
      Choice : value,
    })

  }

  handleDelete = async (Id : number) =>{
    const sp : any = spfi().using(SPFx(this.props.context));
    const list = sp.web.lists.getByTitle("ProfileList");
    await list.items.getById(Id).delete();    
    await this.getAllItems();
       
  }

  // handleUpdate = async (Id : number) =>{
  //   const sp : any = spfi().using(SPFx(this.props.context));
  //   const list = sp.web.lists.getByTitle("ProfileList");
  //   await list.items.getById(Id).update(
  //     {
  //       ProfileId : 0,
  //     ProfileName : "",
  //     ProfileJob : "",
  //     Choice : "",
  //     // choiceOptions: [],
  //     // data : [],
  //     }
  //   );    
  //   await this.getAllItems();
       
  // }

  // Method to select an item for updating
selectForUpdate = (item: {
  Id: number,
  ProfileId: number,
  ProfileName: string,
  ProfileJob: string,
  Choice: string,
  choiceOptions?: any[], // Include other fields as necessary
  data?: any[],
}) => {
  // Update the state with the selected item's data
  this.setState({
      // currentItemId: item.Id,
      ProfileId: item.ProfileId,
      ProfileName: item.ProfileName,
      ProfileJob: item.ProfileJob,
      Choice: item.Choice,
      // Include other fields as necessary
      // choiceOptions: item.choiceOptions || this.state.choiceOptions,
      // data: item.data || this.state.data,
  });
};




  public handleSubmit = async () : Promise<void> => {
    const {ProfileId,ProfileName,ProfileJob,Choice} = this.state as {
     ProfileId : number,
     ProfileName : string,
     ProfileJob : string,
     Choice : string,
    }
    const sp : any = spfi().using(SPFx(this.props.context));

  
    const item : [] = await sp.web.lists.getByTitle("ProfileList").items.add({
      'ProfileId' : ProfileId,
      'ProfileName' : ProfileName,
      'ProfileJob' : ProfileJob,
      'Choice' : Choice,

    });
    this.getAllItems();
    this.setState({ProfileId : 0, ProfileName : "",ProfileJob : "" , Choice : "" })
    
  }

  public render(): React.ReactElement<IWebpart3Props> {
    // const {
    //   description,
      
    // } = this.props;

    return (
      <>
      {
        this.state.data.map((item :{Id : number, ProfileId : number, ProfileName : string, ProfileJob : string, Choice : string}) => {
          return(
            <>
          <div key={item.Id}>
            <h5>Profile Id : {item.ProfileId}</h5>
            <h6>ProfileName : {item.ProfileName}</h6>
            <h6>ProfileJob : {item.ProfileJob}</h6>
            <h6>Choice : {item.Choice}</h6>
          </div>
          <button  onClick={()=>(this.handleDelete(item.Id))}>Delete</button>
          <button onClick={() => this.selectForUpdate(item)}>Update</button>
          </>
          )
        })
      }
      <div>
        <label>
          ProfileId
        </label> 
        <input name='ProfileId' onChange={this.handleChange} value={this.state.ProfileId}>
        </input>
      </div>
      <div>
        <label>
          ProfileName
        </label> 
        <input name='ProfileName' onChange={this.handleChange} value={this.state.ProfileName}>
        </input>
      </div>
      <div>
        <label>
          ProfileJob
        </label> 
        <input name='ProfileJob' onChange={this.handleChange} value={this.state.ProfileJob}>
        </input>
      </div>
      {/* <div>
      <label>Choice</label>
          <select name='Choice' onChange={this.handleChoiceChange} value={this.state.Choice}>
            <option value="">Select Choice</option>
            <option value="Choice 1">Choice 1</option>
            <option value="Choice 2">Choice 2</option>
            <option value="Choice 3">Choice 3</option>
            <option value="Choice 3">Choice 4</option>
          </select>
      </div> */}
      <div>
            <label>Choice</label>
            <select name='Choice' onChange={this.handleChoiceChange} value={this.state.Choice}>
                <option value="">Select Choice</option>
                {this.state.choiceOptions.map((option: string) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
      </div>
      <button type='submit' onClick={this.handleSubmit}>Submit</button>
      </>
    );
  }
}
