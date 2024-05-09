import * as React from 'react';
import type { IWebpart11Props } from './IWebpart11Props';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react';
import { PrimaryButton, Label } from 'office-ui-fabric-react';
import { spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/fields";
import "@pnp/sp/attachments"
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import { IFolder } from "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { Web } from '@pnp/sp/webs';
import { IWebpart11State } from './IWebpart11State';

export default class Webpart11 extends React.Component<IWebpart11Props, IWebpart11State> {
  constructor(props: IWebpart11Props) {
    super(props)
    this.state = {
      selectedFile: null,
      // data: [],
    };
  }

  public getSelectedFile = async (filePickerResult: IFilePickerResult[]) => {
    let myFile = filePickerResult[0];
    this.setState({
      selectedFile: myFile,
    });
  }

  public saveIntoSharePointLibrary = async (file: any) => {
    const sp: any = spfi().using(SPFx(this.props.context));
    try {
      file.documentURL = file.fileAbsoluteUrl;
      let fileContent = await file.downloadFileContent();
      let savefile: IFolder = await sp.web.getFolderByServerRelativePath('DocLibrary1').files.addUsingPath(file.fileName, fileContent, { Overwrite: true });
      this.setState({ selectedFile: null });
      alert('File added successfully')
    }
    catch (error) {
      console.log('saveIntoSharePointLibrary :: Error :', error);
    }
  }

  public render(): React.ReactElement<IWebpart11Props> {
    const { selectedFile } = this.state;
    return (
      <>
        <FilePicker
          buttonLabel="Attachment"
          buttonIcon="Attach"
          onSave={this.getSelectedFile}
          onChange={this.getSelectedFile}
          context={this.props.context}
          hideLinkUploadTab={true}
          hideOneDriveTab={true}
          hideStockImages={true}
          hideLocalUploadTab={true}
          hideSiteFilesTab={true}
        />
        {
          selectedFile && (
            <div>
              <div> FileName : {selectedFile.fileName} </div>
              <div> URL : {selectedFile.fileAbsoluteUrl} </div>
              <PrimaryButton text='Upload' onClick={() => this.saveIntoSharePointLibrary(selectedFile)} />
            </div>
          )
        }
      </>
    );
  }
}
