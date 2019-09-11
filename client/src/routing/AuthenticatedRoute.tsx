import * as React from 'react';

import { Route, Redirect } from "react-router-dom";
import { UserContext, AuthState } from '../user/UserContext';
import { Loader } from 'semantic-ui-react';

export default ({ component: Component, ...rest }) => {
  const { authenticated } = React.useContext(UserContext);

  return (
    <Route
      {...rest}
      render={props =>
        authenticated == AuthState.AUTHENTICATED ? (<Component {...props} />) 
        : authenticated == AuthState.PENDING ? (<Loader />)
        : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
}
