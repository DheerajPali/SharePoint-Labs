import * as React from 'react';
// import styles from './Webpart1.module.scss';
import type { IWebpart1Props } from './IWebpart1Props';
import type { IWebpart1State } from './IWepart1State';
// import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { SPFx, spfi } from '@pnp/sp';
// const sp = spfi('https://bipldev.sharepoint.com/sites/dheeraj/');

// // basic usage
// const allItems: any[] = await sp.web.lists.getByTitle("FAQ List").items.getAll();
// console.log(allItems.length);

export default class Webpart1 extends React.Component<IWebpart1Props, IWebpart1State> {
  constructor(props : IWebpart1Props){
    super(props);
    this.state = {
      Title : '',
      Body : '',
      Letter : '',
      data : []
    };
  }

  componentDidMount() {
      this.getListData();
  }

  public getListData  =  async ()  => {
    const sp = spfi().using(SPFx(this.props.context));
    const allItems = await sp.web.lists.getByTitle("FAQ List").items.getAll();
    console.log(allItems.length);
    this.setState({
      data : allItems,
    });
  }

  public render(): React.ReactElement<IWebpart1Props> {
    return(

    //   <>
    //   <div>
    //     <h1>List Data</h1>
    //     <ul>
    //       {this.state.data.map((item: { Id: React.Key, Title: string, Body: string, Letter: string }) => (
    //         <><li key={item.Id}>{item.Title}</li><li key={item.Id}>{item.Letter}</li><li key={item.Id}>{item.Body}</li></>
    //       ))}
    //     </ul>
    //   </div>
    // </>

      <>
      <h1>agdlkfjd</h1>
        <div>
        {
          this.state.data.map((item : {Id : React.Key, Title : string, Body : string, Letter : string}) =>{
            return(
              <div key={item.Id}>
                <h5>Title {item.Title}</h5>
                <h6>Body {item.Body}</h6>
                <p>Letter {item.Letter}</p>
              </div>
            )
          })
            
        }
          {/* <div>Web part property value: <strong>{escape(this.state.Title)}</strong></div> */}
          </div>
      </>
    );
  }
}
