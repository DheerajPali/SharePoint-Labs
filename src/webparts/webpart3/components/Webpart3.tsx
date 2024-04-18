import * as React from 'react';
import {SPFx, spfi} from "@pnp/sp"
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import type { IWebpart3Props } from './IWebpart3Props';
import type { IWebpart3State } from './IWebpart3State';
import { IWebpart3Add } from './Iwebpart3Add';

export default class Webpart3 extends React.Component<IWebpart3Props,IWebpart3State> {

  constructor (props:IWebpart3Props){
    super(props);
    this.state = {
      ProfileId : 0,
      ProfileName : "",
      ProfileJob : "",
      data : [],
    }
  }

  public getAllItems = async () =>{
    const sp : any = spfi().using(SPFx(this.props.context));
    const ListItems = await sp.web.lists.getByTitle("ProfileList").items.getAll();
    this.setState({
      data :ListItems,
    })
  }

  componentDidMount(): void {
    try {
      this.getAllItems();
      this.handleSubmit();
    } catch (error) {
      console.log(error)
    }
      
  }

  // public handleChange = (event : React.ChangeEvent<HTMLInputElement>) =>{
  //   const name = event.target.name;
  //   const value = event.target.value;
  //   this.setState({
  //     [name] : value,
  //   } as Pick <IWebpart3Add, keyof IWebpart3Add>);
    
  // }

  handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value

    this.setState({
      [name]: value,
    } as unknown as Pick <IWebpart3Add, keyof IWebpart3Add>);
  }


  public handleSubmit = async () : Promise<void> => {
    const {ProfileId,ProfileName,ProfileJob} = this.state as {
     ProfileId : number,
     ProfileName : string,
     ProfileJob : string,
    }
    const sp : any = spfi().using(SPFx(this.props.context));
    const item : [] = await sp.web.lists.getByTitle("ProfileList").items.add({
      'ProfileId' : ProfileId,
      'ProfileName' : ProfileName,
      'ProfileJob' : ProfileJob,

    });
    this.getAllItems();
    
  }

  public render(): React.ReactElement<IWebpart3Props> {
    // const {
    //   description,
      
    // } = this.props;

    return (
      <>
      {
        this.state.data.map((item :{Id : React.Key, ProfileId : number, ProfileName : string, ProfileJob : string}) => {
          return(
          <div key={item.Id}>
            <h5>Profile Id : {item.ProfileId}</h5>
            <h6>ProfileName : {item.ProfileName}</h6>
            <h6>ProfileJob : {item.ProfileJob}</h6>
          </div>
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
      <button type='submit' onClick={this.handleSubmit}>Submit</button>
      </>
    );
  }
}
