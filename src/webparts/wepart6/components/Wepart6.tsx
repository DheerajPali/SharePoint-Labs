import * as React from 'react';
// import styles from './Wepart6.module.scss';
import type { IWepart6Props } from './IWepart6Props';
import { escape } from '@microsoft/sp-lodash-subset';
import { IWebpart6State } from './IWebpart6State';
import { SPFx, spfi } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
// import { ComboBox } from 'office-ui-fabric-react';


export default class Wepart6 extends React.Component<IWepart6Props, IWebpart6State> {

  constructor(props : IWepart6Props){
    super(props)
    this.state = {
    Title : '',
    // userEMail : '',
    // userTitle : '',
    // MyLookup : '',
    data : [],
    // lookupOptions : [],
    // User : [],
    }
  }

    componentDidMount(): void {
        this.getAllItems();
    }

    public getAllItems = async() =>{
      const sp : any = spfi().using(SPFx(this.props.context));
      const listItems = await sp.web.lists.getByTitle("NewList").items.getAll();
      this.setState({
        data: listItems,
      })
      // const list = sp.web.lists.getByTitle("NewList").items.select("Title","User/Title","User/EMail","MyLookup/ProfileJob","MyLookup/ProfileName").expand("MyLookup","User").getAll();

      // const userEMail = list.map((item: any) => item.User != undefined ? item.User.EMail : null);
      // const userTitle = list.map((item: any) => item.User != undefined ? item.User.Title : null);
      // const Title = list.map((item: any) => item.Title != undefined ? item.Title : null);
      // const ProfileJob = list.map((item: any) => item.MyLookup != undefined ? item.MyLookup.ProfileJob : null);
      // const ProfileName = list.map((item: any) => item.MyLookup != undefined ? item.MyLookup.ProfileName : null);

      // console.log("userEMail", userEMail);
      // console.log("userTitle", userTitle);
      // console.log("Title", Title);
  
      // const userData: any = list.map((item: any, index: string | number) => {
      //   return {...item,
      //     userTitle: userEMail[index],
      //     userEMail: userTitle[index],
      //     Title: Title[index],
      //     // ProfileJob : ProfileJob[index],
      //     // ProfileName : ProfileName[index],
      //   };
      // });
      // this.setState({
      //   data: userData,
      // });
    }


    // public getLookupOptions = async () => {
    //   try {
    //     const sp: any = spfi().using(SPFx(this.props.context));
  
    //     // Select the 'ProfileJob' field when fetching items
    //     const spList: any[] = await sp.web.lists.getByTitle("ProfileList").items.select('ID', 'ProfileName').getAll();
    //     let tempCurreny: any  = [];
    //     console.log("spList", spList);
  
    //     spList.forEach((value: any) => {
    //       tempCurreny.push({ key: value.ID, text: value.ProfileName });
    //     });
  
    //     console.log("tempCurreny", tempCurreny);
    //     this.setState({ lookupOptions: tempCurreny });
  
    //   } catch (error) {
    //     console.log("Error in getLookupOptions:", error);
    //   }
    // }
  
  public render(): React.ReactElement<IWepart6Props> {
    return (
      <>
      <h3>Future belong to those ,who work for it.</h3>
      {
        this.state.data.map((item:{Title : string})=>{
          return(
            <div>Title : {item.Title}</div>
          )
        })
      }

      {/* <ComboBox
            label="LookupJob"
            options={this.state.lookupOptions}
            selectedKey={this.state.MyLookup}
            // onChange={this.handleChangeMyLookup}
            data-name="MyLookup" // Add the name property here
          />
          



           {
        this.state.data.map((item : {Id : React.Key, Title : string, userEMail : string , MyLookup : any,userTitle: string, ProfileJob: string, ProfileName : string}) => {
          return(
            <div key={item.Id}>
              <h3>Title : {item.Title}</h3>
              <h4>userEMail : {item.userEMail}</h4>
              <h4>userTitle : {item.userTitle}</h4>
              <h4>ProfileJob : {item.MyLookup.ProfileJob}</h4>
              <h4>ProfileName : {item.MyLookup.ProfileName}</h4>
            </div>
            
          )
          
        })
      }
          
          
          
          */}
      </>
      
    );
  }


}
