import { SuspenseProps } from "react";

export interface IEmployee {
    Title: string;
    Person: {
      LookupId: number;
      LookupValue: string;
    };
  }