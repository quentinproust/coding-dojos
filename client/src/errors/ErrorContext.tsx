import * as React from 'react';
import uuid from "uuid";

export class ErrorData {
  id: string
  target: string 
  message: string

  constructor(target: string, message: string) {
    this.id = uuid.v4();
    this.target = target;
    this.message = message;
  }
}

export interface ErrorContextData {
  errors: ErrorData[]
}

export interface ErrorContextHandle {
  pushError: (target: string, message: string) => void
  dismissError: (id: string) => void
}

export const ErrorContext = React.createContext<ErrorContextData & ErrorContextHandle>({
  errors: [],
  pushError: (target, message) => {},
  dismissError: (id) => {},
});
