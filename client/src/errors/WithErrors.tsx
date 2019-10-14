import * as React from 'react';
import { ErrorData, ErrorContext } from './ErrorContext';
import ErrorMessages from './ErrorMessages';

export const WithErrors = ({ children }) => {
  const [contextState, setContext] = React.useState<ErrorData[]>([]);

  const pushError = (target: string, message: string) => {
    setContext([...contextState, new ErrorData(target, message)]);
  };

  const dismissError = (id: string) => {
    setContext(contextState.filter(e => e.id !== id));
  };

  return (
    <ErrorContext.Provider value={{ errors: contextState, pushError, dismissError }}>
      <ErrorMessages />
      {children}
    </ErrorContext.Provider>
  );
};
