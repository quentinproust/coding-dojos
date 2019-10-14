import * as React from 'react';
import { Container, Message } from 'semantic-ui-react';
import { ErrorContext } from './ErrorContext';

export default () => {

  const { errors, dismissError } = React.useContext(ErrorContext);

  return (
    <Container>
      {errors.map(myError =>
        <Message
          key={myError.id}
          header="Diantre !!! "
          onDismiss={e => dismissError(myError.id)}
          icon='times'
          color="red"
          content={myError.message}
        />)
      )}
    </Container>
  );
}
