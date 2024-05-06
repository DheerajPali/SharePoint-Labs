import * as React from 'react';
import { IWebpart5Props } from './IWebpart5Props';
import { IWebpart5State } from './IWebpart5State';
import { SPFx, spfi } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { DefaultButton, DetailsList, IColumn, SelectionMode } from 'office-ui-fabric-react';
import { TextField } from '@fluentui/react';
import { IWebpart5Add } from './IWebpart5Add';


export default class Webpart5 extends React.Component<IWebpart5Props, IWebpart5State> {
  constructor(props: IWebpart5Props) {

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
        name: 'Person Title',
        fieldName: 'Person',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          return <span>{item.Person ? item.Person.Title : ''}</span>;
        }
      },
      {
        key: 'column3',
        name: 'Person Email',
        fieldName: 'Person',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item) => {
          return <span>{item.Person ? item.Person.EMail : ''}</span>;
        }
      },
      {
        key: 'column4',
        name: 'Actions',
        fieldName: 'Actions',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        // onRender: (item) => {
        //   return (
        //     <DefaultButton text="Delete" onClick={() => { this.handleDelete(item.ID) }} />
        //   );
        // }
      },
      {
        key: 'column4',
        name: 'Action1',
        fieldName: 'Action1',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        // onRender: (item) => {
        //   return (
        //     <DefaultButton text="Edit" onClick={() => { this.handleEdit(item) }} />
        //   );
        // }
      }
    ];
    super(props);
    this.state = {
      ID: '',
      Title: '',
      userEMail: '',
      userTitle: '',
      data: [],
      Person: [],
      columns: columns,
    };
  }


  public async componentDidMount() {
    try {
      // await this.getAll();
    } catch (error) {
      console.log("error in getAll method ", error);
    }
  }

  // public getAll = async () => {
  //   const sp: any = spfi().using(SPFx(this.props.context));
  //   const listData = await sp.web.lists.getByTitle("List2").items.select("ID", "Title", "Person/EMail", "Person/Title").expand("Person").getAll();
  //   console.log("list", listData);

  //   const personEMail = listData.map((item: any) => item.Person != undefined ? item.Person.EMail : null);
  //   const personTitle = listData.map((item: any) => item.Person != undefined ? item.Person.Title : null);
  //   const Title = listData.map((item: any) => item.Person != undefined ? item.Title : null);
  //   console.log("personEMail", personEMail);
  //   console.log("personTitle", personTitle);
  //   console.log("Title", Title);


  //   const personData: any = listData.map((item: any, index: string | number) => {
  //     return {
  //       ...item,
  //       userTitle: personTitle[index],
  //       userEMail: personEMail[index],
  //       Title: Title[index],
  //     };
  //   });
  //   console.log("personData", personData);

  //   this.setState({
  //     data: personData,
  //   })
  // }


  // handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   this.setState({
  //     [name]: value,
  //   } as unknown as Pick<IWebpart5State, keyof IWebpart5State>);
  // }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value
    this.setState({
      [name]: value,
    } as unknown as Pick<IWebpart5Add, keyof IWebpart5Add>);
  }

  // private handleDelete = async (title: string) => {
  //   try {
  //     const sp = spfi().using(SPFx(this.props.context));
  //     const list = sp.web.lists.getByTitle("List2");

  //     // Retrieve the item that matches the specified Title
  //     const items = await list.items.filter(`Title eq '${title}'`).getAll();

  //     if (items.length > 0) {
  //       const itemId = items[0].Id; // Get the Id of the first matching item

  //       // Delete the item by its Id
  //       await list.items.getById(itemId).delete();

  //       // Refresh the list data after deletion
  //       await this.getAll();
  //       console.log(`Item with title '${title}' deleted successfully.`);
  //       alert(`Item with title '${title}' deleted successfully.`);
  //     } else {
  //       console.log(`No item found with title '${title}'.`);
  //       alert(`No item found with title '${title}'.`)
  //     }
  //   } catch (error) {
  //     console.log("Error deleting item:", error);
  //     alert("Error deleting item:");
  //   }
  // };

  // handleDelete = async (Id: React.Key) => {
  //   try {
  //     console.log("Deleting item with ID:", Id);
  //     const sp: any = spfi().using(SPFx(this.props.context));
  //     const list = sp.web.lists.getByTitle("List2");
  //     await list.items.getById(Id).delete();
  //     console.log("Item deleted successfully");
  //     await this.getAll(); // Refresh the data after deletion
  //     alert('Item deleted successfully');
  //   } catch (error) {
  //     console.error("Error in delete", error);
  //     alert('Error occurred while deleting item.');
  //   }
  // }

  // public handleEdit = async (item: { Title: string, userEMail: string, userTitle: string, Person: [], ID: number }) => {
  //   try {
  //     this.setState({
  //       Title: item.Title,
  //       Person: item.Person,
  //       ID: item.ID,
  //     });
  //   } catch (error) {
  //     console.log("Error in handleEdit", error);
  //   }
  // }

  // public handleUpdate = async (selectedPeople: any[]): Promise<void> => {
  //   const { ID, Title } = this.state;
  //   const sp = spfi().using(SPFx(this.props.context));

  //   if (selectedPeople.length > 0) {
  //     const updateTasks = selectedPeople.map(async (user) => {
  //       const matchingIds = this.state.data.filter((item : any) => item.ID === ID).map((item:any) => item.Id);
  //       const itemId = matchingIds.length > 0 ? matchingIds[0] : undefined;

  //       if (itemId) {
  //         try {
  //           await sp.web.lists.getByTitle("List2").items.getById(itemId).update({
  //             'Title': Title,
  //             'PersonId': user.id,
  //           });
  //         } catch (error) {
  //           console.error('Error updating item:', error);
  //           throw error;
  //         }
  //       }
  //     });

  //     try {
  //       await Promise.all(updateTasks);
  //       await this.getAll();
  //       this.setState({ Title: '', Person: [] });
  //       alert('Updated Successfully');
  //     } catch (error) {
  //       console.error('Error updating items:', error);
  //       alert('Failed to update items. Please try again.');
  //     }
  //   } else {
  //     alert('Please select at least one person.');
  //   }
  // };




  // private handleSubmit = async (): Promise<void> => {
  //   const { Title, Person } = this.state as {
  //     Title: string,
  //     Person: any,
  //   };

  //   if (Person.length > 0) {
  //     try {
  //       const sp: any = spfi().using(SPFx(this.props.context));
  //       const list = sp.web.lists.getByTitle("List2");

  //       // Create an array of promises to add items for each selected person
  //       const addTasks = Person.map(async (user: { id: any; }) => {
  //         // Assuming `user.id` represents a single user ID (not an array)
  //         const personId = user.id; // Get the user ID

  //         // Add a new item to the SharePoint list
  //         await list.items.add({
  //           Title: Title,
  //           PersonId: personId, // Assign the user ID as a single value
  //         });
  //       });

  //       // await Promise.all(addTasks);
  //       this.setState({ Title: '', Person: [] }); // Clear form after successful addition
  //       alert('Added Successfully');
  //     } catch (error) {
  //       console.error('Error adding items:', error);
  //       alert('Failed to add items. Please try again.');
  //     }
  //   } else {
  //     alert('Please select at least one person.');
  //   }
  // };
  public onSubmit = () => {
    const { Person,Title } = this.state;
    const sp = spfi().using(SPFx(this.props.context));
   
    // Extracting user IDs from selectedPersons array
    const personIds = Person.map((person: { id: any; }) => person.id);
 
    sp.web.lists.getByTitle('List2').items.add({
      'Title': Title, // Add more fields as needed
    //   PersonId: { results: personIds } // Change 'PersonId' to your field's internal name
     PersonId: personIds
    })
    .then(() => {
      console.log('Item added successfully');
    })
    .catch(error => {
      console.error('Error adding item: ', error);
    });
}


  // private handlePeoplePickerChange = (selectedItems: any[]) => {
  //   this.setState({
  //     Person: selectedItems, // Store selected users in the state array
  //   });
  // };
  // private handlePeoplePickerChange = (selectedItems: any[]) => {
  //   this.setState({
  //     Person: selectedItems // Store selected users in the state array
  //   });
  // };
  public onPeoplePickerChange = (items:any) => {
    this.setState({ Person: items });
  }


  public render(): React.ReactElement<IWebpart5Props> {
    // const {Person} = this.state;
    return (
      <>
        {/* <DetailsList
          items={this.state.data}
          columns={this.state.columns}
          selectionMode={SelectionMode.none}
          getKey={(item) => item.Id}
        /> */}

        {/* Render selected users */}
        {this.state.Person.length > 0 && (
          <div>
            <h3>Selected People:</h3>
            <ul>
              {this.state.Person.map((person: any) => (
                <li key={person.id}>{person.text}</li>
              ))}
            </ul>
          </div>
        )}

        <div>

          {/* {
          this.state.data.map((item : {Person : any, Title : string})=> {
            return(
              <div>
                <h4>Perosn Name :{item.Person.Title}</h4>
                <h6>Perosn Email :{item.Person.EMail}</h6>
                <h6>Letter :{item.Title}</h6>
              </div>
            )
          })
        } */}
          <TextField label="Letter" name="Title" onChange={this.handleChange} value={this.state.Title} />

          {/* <PeoplePicker
            context={this.props.context}
            titleText="Select People"
            personSelectionLimit={1}
            showtooltip={true}
            // Use defaultSelectedUsers to set initial selected users
            defaultSelectedUsers={[this.state.Person]}
            onChange={this.handlePeoplePickerChange}
            ensureUser={true}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000}
          /> */}
          {/* <PeoplePicker
            context={this.props.context}
            titleText="Select People"
            personSelectionLimit={3} // Example: Set a limit for maximum selected users
            showtooltip={true}
            defaultSelectedUsers={[]}
            onChange={this.handlePeoplePickerChange}
            ensureUser={true}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000}
          /> */}
          <div>
        <PeoplePicker
          context={this.props.context}
          titleText="Select People"
          personSelectionLimit={3}
          showtooltip={true}
          // Use defaultSelectedUsers to set initial selected users
          defaultSelectedUsers={[]}        
          onChange={this.onPeoplePickerChange}
          ensureUser={true}
          principalTypes={[PrincipalType.User]}
          resolveDelay={1000}
        />
        <button onClick={this.onSubmit}>Submit</button>
      </div>


          <DefaultButton text='Submit' onClick={this.onSubmit} />
          {/* <DefaultButton text='Update' onClick={() => { this.handleUpdate(this.state.Person) }} /> */}
        </div>
      </>
    );
  }
}
