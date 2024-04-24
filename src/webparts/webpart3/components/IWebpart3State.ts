import * as React from "react";
  
  export interface IWebpart3State {
    ID : React.Key;
    ProfileId: number;
    ProfileName: string;
    ProfileJob: string;
    Choice: string;
    choiceOptions: [];
    data: [];
  }