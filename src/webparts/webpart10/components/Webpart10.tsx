import * as React from 'react';
// import styles from './Webpart10.module.scss';
import type { IWebpart10Props } from './IWebpart10Props';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react';

import {PrimaryButton, Label } from 'office-ui-fabric-react';
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
import { IWebpart10State } from './IWebpart10State';
// import { IWebpart7Add } from './IFormWebpartAdd';

export default class Webpart10 extends React.Component<IWebpart10Props, IWebpart10State> {

  constructor(props: IWebpart10Props) {
    super(props);
    this.state = {
      selectedFile: null
    };
  }

  private getSelectedFile = async (filePickerResult: IFilePickerResult[]) => {
    const selectedFile = filePickerResult[0];
    this.setState({ selectedFile });
  }

  public async saveIntoSharePoint(File: any) {
    const sp: any = spfi().using(SPFx(this.props.context));
    // let a = file;
    // let capexdetails = { ...this.state.selectedFile };
    let web = Web('https://bipldev.sharepoint.com/sites/dheeraj/');
    let LibraryForUpload = sp.web.lists.getByTitle("DocLibrary1");

    try {
      if (File.fileAbsoluteUrl == null) {
        File.downloadFileContent()
          .then(async (r: any) => {

            // let fileresult = await web.getFolderByServerRelativePath(`Shared%20Documents/Forms/AllItems${this.state.File.Math.random()}`).files.add(file.fileName, r, true);
            // .then(
            // f => {

            //   f.file.getItem().then(item => {

            //     item.update({
            //       gen_CapexNumberId: this.state.itemID,
            //       gen_FileUploaded: true
            //     }, "*", entityTypeFullNameDocument).then((myupdate) => {

            //     });
            //   }).then(e => {
            //     // setTimeout(() => {
            //     //   window.location.href = this.props.context.pageContext.web.absoluteUrl + "/SitePages/Dashboard.aspx";
            //     // }, 1000);
            //   });
            // }
            // );
          });
      }
      else {
        File.documentURL = File.fileAbsoluteUrl;
        this.setState({ selectedFile: File });
        this.saveSupportingfilesIntoLibrary(this.state.selectedFile, File.documentURL);
      }

    }
    catch (error) {
      // this._listoperation.AddItemsToLogList(this.props.context, web, logList, "saveIntoSharePoint", "capex", "file upload for capex detail", error);
    }
  }

  public async saveSupportingfilesIntoLibrary(file: any, Material_Ref: any) {
    const sp: any = spfi().using(SPFx(this.props.context));


    try {
      let fileContent = await file.downloadFileContent();
      // for (let i = 0; i < file.length; i++) {
      //   if (file[i].fileAbsoluteUrl == null) {
      //     await file[i].downloadFileContent().then(async (r: string | ArrayBuffer | Blob) => {
      //       const sp: any = spfi().using(SPFx(this.props.context));
      //       let fileresult: IFolder = await sp.web.getFolderByServerRelativePath(Material_Ref).files.addUsingPath(file[i].fileName, r, { Overwrite: true });
      //     });
      //   } else {
      //   }
      // }
      let fileresult: IFolder = await sp.web.getFolderByServerRelativePath('DocLibrary1').files.addUsingPath(file.fileName, fileContent, { Overwrite: true });
      this.setState({ selectedFile:null });
      alert('File added Successfully')
    }
    catch (error) {
      console.log("saveSupportingfilesIntoLibrary :: Error :", error);
      alert('Something went wrong');
    }
  }

  public render(): React.ReactElement<IWebpart10Props> {
    const { selectedFile } = this.state;

    return (
      <div>
        <Label>Upload Document</Label>
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
        {selectedFile && (
          <div>
            Selected File: {selectedFile.fileName}
            <br />
            File Url: {selectedFile.fileAbsoluteUrl}
            <br />

            <PrimaryButton onClick={() => this.saveIntoSharePoint(this.state.selectedFile)} text='Upload' />

          </div>
        )}
      </div>
    );
  }
}

