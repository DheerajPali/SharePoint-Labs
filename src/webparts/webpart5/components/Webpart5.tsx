import * as React from 'react';
import { IWebpart5Props } from './IWebpart5Props';
import { IEmployee } from './IWebpartState'; // Import the interface
// import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

interface IWebpart5State {
  employees: IEmployee[];
}

export default class Webpart5 extends React.Component<IWebpart5Props, IWebpart5State> {
  constructor(props: IWebpart5Props) {
    super(props);
    this.state = {
      employees: []
    };
  }

  public async componentDidMount() {
    await this.props.context.sp.setup({
      spfxContext: this.props.context
    });

    const employees = await this.props.context.getDataFromList();
    this.setState({ employees });
  }

  public render(): React.ReactElement<IWebpart5Props> {
    return (
      <div>
        <h2>Employees</h2>
        <ul>
          {this.state.employees.map(employee => (
            <li key={employee.Person.LookupId}>
              <strong>{employee.Title}</strong>: {employee.Person.LookupValue}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
