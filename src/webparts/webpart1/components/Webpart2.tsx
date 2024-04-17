
import * as React from 'react'
import { SPFx, spfi } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import { IWebpart1Props } from './IWebpart1Props';
import { IWebpart1State } from './IWepart1State';


export default class Webpart2 extends React.Component<IWebpart1Props, IWebpart1State>{
    constructor(props : IWebpart1Props){
        super(props);
        this.state = {
            Title : '',
            Body : '',
            Letter : '',
            data : []
        }
    }

    componentDidMount(): void {
        this.method1();
    }

    public method1 = async () =>{
        const sp: any = spfi().using(SPFx(this.props.context));
        const allItems: any[] = await sp.web.lists.getByTitle("FAQ List").items.getAll();
        this.setState({
            data : allItems,
        })
    }
    
    public render() : React.ReactElement<IWebpart1Props>{
        return(
            <>
            {
                this.state.data.map((item : {Id : React.Key, Title : string, Body : string, Letter : string}) => {
                    return(
                        <>
                        <div key={item.Id}>
                            <h3>{item.Title}</h3>
                            <h6>{item.Body}</h6>
                            <h6>{item.Letter}</h6>
                        </div>
                        </>
                    )
                })
            }
            </>
        )
        
    }

}
