
import * as React from 'react'
import {SPFx, spfi} from "@pnp/sp"
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { IWebpart2Props } from './IWebpart2Props';
import { IWebpart2State } from './IWebpart2State';
import { IWebpart2Add } from './IWebpart2Add';
// import { IItemAddResult } from "@pnp/sp/items";


export default class IWebpart2 extends React.Component<IWebpart2Props, IWebpart2State>{
  constructor(props : IWebpart2Props){
    super(props);
    this.state = {
      Title : "",
      Body : "",
      Letter: "",
      data : [],}
  }

  
  public getAllItems = async () => {
    const sp: any = spfi().using(SPFx(this.props.context));
    const allItems = await sp.web.lists.getByTitle("FAQ List").items.getAll();
     this.setState({
      data : allItems,
     })
  }
   

  componentDidMount(): void {
      this.getAllItems();
      this.handleSubmit();
  }

  handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value

    this.setState({
      [name] : value,
    } as Pick <IWebpart2Add, keyof IWebpart2Add>);
  }

  handleSubmit = async () : Promise<void> => {
    const {Title,Body,Letter} = this.state as{
          Title : string,
          Body : string,
          Letter: string
    }

    const sp: any = spfi().using(SPFx(this.props.context));
    const iar: [] = await sp.web.lists.getByTitle("FAQ List").items.add({
      'Title': Title,
      'Body' : Body,
      'Letter' : Letter  
    });
    this.getAllItems(); // Refresh data after adding item
    this.setState({Title : "",Body : "", Letter : ""});
    
  }

  public render () : React.ReactElement<IWebpart2Props>{
    return(
      <>
        {
          this.state.data.map((item : {Id : React.Key , Title : string, Body : string , Letter : string}) => {
            return (
              <>
              <div key={item.Id}>
                <h4>Product Name : {item.Title}</h4>
                <h6>Details : {item.Body}</h6>
                <h6>Letter : {item.Letter}</h6>
              </div>

                
               </> 
            )
          })
        }
            <div>
              <label>Title</label>
              <input name="Title" onChange={this.handleChange} value={this.state.Title}></input>
            </div>
            <div>
              <label>Body</label>
              <input name="Body" onChange={this.handleChange} value={this.state.Body}></input>
            </div>
            <div>
              <label>Letter</label>
              <input name="Letter" onChange={this.handleChange} value={this.state.Letter}></input>
            </div>
            <button type='submit' onClick={this.handleSubmit}>Submit</button>
      </>
    )
  }

}