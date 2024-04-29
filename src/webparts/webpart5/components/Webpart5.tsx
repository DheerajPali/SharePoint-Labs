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
        onRender: (item) => {
          return (
            <DefaultButton text="Delete" onClick={() => { this.handleDelete(item.ID) }} />
          );
        }
      },
      {
        key: 'column4',
        name: 'Action1',
        fieldName: 'Action1',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        onRender: (item) => {
          return (
            <DefaultButton text="Edit" onClick={() => { this.handleEdit(item) }} />
          );
        }
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
      await this.getAll();
    } catch (error) {
      console.log("error in getAll method ", error);
    }
  }

  public getAll = async () => {
    const sp: any = spfi().using(SPFx(this.props.context));
    const listData = await sp.web.lists.getByTitle("List2").items.select("ID", "Title", "Person/EMail", "Person/Title").expand("Person").getAll();
    console.log("list", listData);

    const personEMail = listData.map((item: any) => item.Person != undefined ? item.Person.EMail : null);
    const personTitle = listData.map((item: any) => item.Person != undefined ? item.Person.Title : null);
    const Title = listData.map((item: any) => item.Person != undefined ? item.Title : null);
    console.log("personEMail", personEMail);
    console.log("personTitle", personTitle);
    console.log("Title", Title);


    const personData: any = listData.map((item: any, index: string | number) => {
      return {
        ...item,
        userTitle: personTitle[index],
        userEMail: personEMail[index],
        Title: Title[index],
      };
    });
    console.log("personData", personData);

    this.setState({
      data: personData,
    })
  }


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

  handleDelete = async (Id: React.Key) => {
    try {
      console.log("Deleting item with ID:", Id);
      const sp: any = spfi().using(SPFx(this.props.context));
      const list = sp.web.lists.getByTitle("List2");
      await list.items.getById(Id).delete();
      console.log("Item deleted successfully");
      await this.getAll(); // Refresh the data after deletion
      alert('Item deleted successfully');
    } catch (error) {
      console.error("Error in delete", error);
      alert('Error occurred while deleting item.');
    }
  }

  public handleEdit = async (item: { Title: string, userEMail: string, userTitle: string, Person: [], ID: number }) => {
    try {
      this.setState({
        Title: item.Title,
        Person: item.Person,
        ID: item.ID,
      });
    } catch (error) {
      console.log("Error in handleEdit", error);
    }
  }

  handleUpdate = async (selectedPerson: any): Promise<void> => {
    const { ID, Title, data } = this.state;
    const sp = spfi().using(SPFx(this.props.context));

    const matchingIds = data.filter((item: { ID: React.Key }) => item.ID === ID).map((item: { Id: number }) => item.Id);

    const itemId = matchingIds.length > 0 ? matchingIds[0] : undefined;


    const user = selectedPerson;
    if (itemId) {
      try {
        const list = await sp.web.lists.getByTitle("List2").items.getById(itemId).update({
          'Title': Title,
          // 'Description': description,
          'PersonId': user.id,
        })

        this.getAll();
        this.setState({ Title: '', Person: '' });
        alert('Updated Successfully');
      } catch (error) {
        console.error('Error adding item:', error);
        alert('Failed to add item. Please try again.');
      }
    } else {
      alert('Please fill all the fields');
    }
  };




  public handleSubmit = async (selectedPerson: any): Promise<void> => {
    const { Title, Person } = this.state as {
      Title: string,
      Person: any,
    }
    // const sp: any = spfi().using(SPFx(this.props.context));

    const sp: any = spfi().using(SPFx(this.props.context));
    console.log(selectedPerson.text);
    console.log(selectedPerson.secondaryText);
    const user = selectedPerson;
    if (user) {
      try {
        const list = await sp.web.lists.getByTitle("List2").items.add({
          'Title': Title,
          // 'Description': description,
          'PersonId': user.id,
          // 'LookupColumnId': lookColumnValue, // Add this line
        });

        await this.getAll();
        this.setState({ Title: '', Person: '' });
        alert('Added Successfully');
      } catch (error) {
        console.error('Error adding item:', error);
        alert('Failed to add item. Please try again.');
      }
    } else {
      alert('Please fill all the fields');
    }
  }

  private handlePeoplePickerChange = (selectedItems: any[]) => {
    if (selectedItems.length > 0) {
      this.setState({
        Person: selectedItems[0], // Assuming you want to select only one person
      });
    } else {
      this.setState({
        Person: null,
      });
    }
  };


  public render(): React.ReactElement<IWebpart5Props> {
    // const {Person} = this.state;
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

          <PeoplePicker
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
          />
          <DefaultButton text='Submit' onClick={() => { this.handleSubmit(this.state.Person) }} />
          <DefaultButton text='Update' onClick={() => { this.handleUpdate(this.state.Person) }} />
        </div>
      </>
    );
  }
}
