import * as React from 'react';

import { Route, Redirect } from "react-router-dom";
import { UserContext, AuthState } from '../user/UserContext';
import { Loader } from 'semantic-ui-react';

export default ({ component: Component, role, ...rest }) => {
  const { authenticated, user } = React.useContext(UserContext);

  return (
    <Route
      {...rest}
      render={props =>
        authenticated == AuthState.AUTHENTICATED && user.grantedAuthorities.includes(role) ? (<Component {...props} />) 
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
