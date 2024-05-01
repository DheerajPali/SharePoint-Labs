import * as React from 'react';
// import styles from './Wepart6.module.scss';
import type { IWepart6Props } from './IWepart6Props';
import { IWebpart6State } from './IWebpart6State';
import { SPFx, spfi } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { ComboBox, DefaultButton, DetailsList, IColumn, IComboBox, SelectionMode, TextField } from 'office-ui-fabric-react';
import { IWebpart6Add } from './IWebpart6Add';
import { PrimaryButton } from '@fluentui/react';
import { PeoplePicker } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import { Item } from '@pnp/sp/items';
// import { ComboBox } from 'office-ui-fabric-react';


export default class Wepart6 extends React.Component<IWepart6Props, IWebpart6State> {

  constructor(props: IWepart6Props) {
    super(props)

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
        name: 'ProfileName',
        fieldName: 'MyLookup',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          return <span>{item.MyLookup ? item.MyLookup.ProfileName : ''}</span>;
        }
      },
      {
        key: 'column3',
        name: 'ProfileJob',
        fieldName: 'MyLookup',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          return <span>{item.MyLookup ? item.MyLookup.ProfileJob : ''}</span>;
        }
      },
      {
        key: 'column4',
        name: 'User Title',
        fieldName: 'User',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          return <span>{item.User ? item.User.Title : ''}</span>;
        }
      },
      {
        key: 'column5',
        name: 'User EMail',
        fieldName: 'User',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          return <span>{item.User ? item.User.EMail : ''}</span>;
        }
      },
      {
        key: 'column6',
        name: 'Delete',
        fieldName: 'Delete',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          return(<DefaultButton text='Delete' onClick={()=> this.handleDelete(item.ID)}/>);
        }
      },
      {
        key: 'column6',
        name: 'Edit',
        fieldName: 'Edit',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          return(<DefaultButton text='Edit' onClick={()=> this.handleEdit(item)}/>);
        }
      },
    ];

    this.state = {
      ID : '',
      Title: '',
      MyLookup: '',
      User: [],
      userEMail: '',
      userTitle: '',
      columns: columns,
      data: [],
      lookupOptions : [],
    }
  }
  componentDidMount(): void {
    this.getAllItems();
    this.getLookupOptions();
  }

  public getAllItems = async () => {
    try {
      const sp: any = spfi().using(SPFx(this.props.context));
      const listItems = await sp.web.lists.getByTitle("NewList").items.select("ID","Title", "MyLookup/ProfileJob", "MyLookup/ProfileName", "User/EMail", "User/Title").expand("MyLookup", "User").getAll();
      this.setState({
        data: listItems,
      })
    } catch (error) {
      console.log("getAllItems :: Error : ", error);
    }
  }

  public getLookupOptions = async() => {
    const sp: any = spfi().using(SPFx(this.props.context));
    const profileListdata = await sp.web.lists.getByTitle("ProfileList").items.select("ID", "ProfileName").getAll();
    const tempOptions : any [] = []
    console.log("profileListdata",profileListdata);

    if(profileListdata.length > 0){
      profileListdata.forEach((value: any) => {
        tempOptions.push({ key: value.ID, text: value.ProfileName });
      });
      try {
        this.setState({
          lookupOptions: tempOptions,
        })
      } catch (error) {
        console.log("getAllItems :: Error : ", error);
      }
    }
    else{
      alert('Not getting Lookup options');
    }    
  }


  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const name = event.target.name
      const value = event.target.value

      this.setState({
        [name]: value,
      } as Pick<IWebpart6Add, keyof IWebpart6Add>);
    } catch (error) {
      console.log("handleChange :: Error :", error);
    }
  }

  handleChangeLookup = (event: React.FormEvent<IComboBox>, option?: { key: string | number }) => {
    try {
      if (option) {
        this.setState({ MyLookup: option.key as string });
      } else {
        this.setState({ MyLookup: ' ' });
      }
    } catch (error) {
      console.log("handleChangeLookup :: Error :",error);
    }
    
  }
  private handlePeoplePickerChange = (selectedUsers: any[]) => {
    if (selectedUsers.length > 0) {
      this.setState({
        User: selectedUsers[0], // Assuming you want to select only one person
      });
    } else {
      this.setState({
        User: null,
      });
    }
  };

  handleAdd = async (selectedKey : string,selectedUser : any) => {
    const { Title } = this.state;
    const sp = spfi().using(SPFx(this.props.context));
    const userId = selectedUser.id;
    console.log("userId",userId);
    if (Title.trim() != "" && selectedKey !="" && userId != undefined) {
      try {
        const addItem = await sp.web.lists.getByTitle("NewList").items.add({
          'Title': Title,
          'MyLookupId': parseInt(selectedKey),
          'UserId' : userId, 
        })
        await this.getAllItems();
        this.setState({
          Title: '',
          MyLookup: '',
          User: '',
        })
        alert('Added Successfully');
      } catch (error) {
        console.log("handleAdd :: Error : ", error);
        alert('Something went wrong');
      }
    }
    else{
      alert("All fields are Requierd")
    }
  }

  handleEdit = async ( item : {Title : string , ID : number , MyLookup : any,User : any }) =>{
    // const selectedMyLookup= item.MyLookup?.ProfileName;
    const selectedUser = item.User?.EMail;
    const selectedKey = item.MyLookup?.ID
        this.setState({
          Title : item.Title,
          ID : item.ID,
          User : selectedUser,
          MyLookup : selectedKey,
        })
  }

  handleUpdate = async(ID: any,selectedKey : string,selectedUser : any) =>{
    const {Title} = this.state;
    if(Title != "" && selectedKey != undefined && selectedUser != null)
    {
      try {
        const sp: any = spfi().using(SPFx(this.props.context));
        const myItem1 = await sp.web.lists.getByTitle("NewList").items.getById(ID).update(
          {
            'Title': Title,
            'MyLookupId': parseInt(selectedKey),
            'UserId' : selectedUser.id, 
          }
        )
        this.getAllItems();
        this.setState({
          Title : '',
          MyLookup: '',
          User : '',
        })
      } catch (error) {
        console.log("handleUpdate :: Error :",error);
      }
  }
  else{
    alert("Please fill required fields");
  }
    
  }

  handleDelete = async(Id : number) =>{
    try {
      const sp: any = spfi().using(SPFx(this.props.context));
      const itemDelete = await sp.web.lists.getByTitle("NewList").items.getById(Id).delete();
      this.getAllItems();
    } catch (error) {
      console.log("handleDelete :: Error :",error);
    }
    
  }

  public render(): React.ReactElement<IWepart6Props> {
    return (
      <>
        <h3>Future belong to those ,who work for it.</h3>
        <DetailsList
          items={this.state.data}
          columns={this.state.columns}
          selectionMode={SelectionMode.none}
          getKey={(item) => item.Id} // Assuming there's a unique identifier property like Id
        />
        <TextField label="Title" name="Title" onChange={this.handleChange} value={this.state.Title} />
        <ComboBox
            label="ProfileName"
            options={this.state.lookupOptions}
            selectedKey={this.state.MyLookup}
            onChange={this.handleChangeLookup}
            data-name="MyLookup" // Add the name property here
          />
          <PeoplePicker
            context={this.props.context}
            titleText="Select People"
            personSelectionLimit={1}
            showtooltip={true}
            // Use defaultSelectedUsers to set initial selected users
            defaultSelectedUsers={[this.state.User]}
            onChange={this.handlePeoplePickerChange}
            ensureUser={true}
            // principalTypes={[PrincipalType.User]}
            resolveDelay={1000}
          />
        <br />
        <PrimaryButton text='Add' onClick={()=>{this.handleAdd(this.state.MyLookup,this.state.User)}} />
        <DefaultButton text='Update' onClick={()=>{this.handleUpdate(this.state.ID,this.state.MyLookup,this.state.User)}} />
      </>
    );
  }


}
