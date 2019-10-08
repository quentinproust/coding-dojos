import * as React from 'react';
import { UserService } from './UserService';
import { UserContext, UserContextData, AuthState } from './UserContext';

export const WithUser = ({ children }) => {
  const [contextState, setContext] = React.useState<UserContextData>({
    authenticated: AuthState.PENDING,
  });

  const setUser = user => {
    if (user) {
      setContext({
        authenticated: AuthState.AUTHENTICATED,
        user: user
      })
    } else {
      setContext({
        authenticated: AuthState.NOT_AUTHENTICATED,
      });
    }
  }

  React.useEffect(() => {
    setContext({ ...contextState, authenticated: AuthState.PENDING })

    const userService = new UserService();
    userService.loadAuthenticatedUser()
      .then(user => {
        console.log('authentication_response', user);
        setContext({
          authenticated: user.authenticated ? AuthState.AUTHENTICATED : AuthState.NOT_AUTHENTICATED,
          user: user.attributes
        });
      })
      .catch(() => {
        setContext({
          authenticated: AuthState.NOT_AUTHENTICATED,
        })
      })
  }, []);

  return (
    <UserContext.Provider value={{ ...contextState, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const Anonymous = ({ children }) => {
  const value = React.useContext(UserContext);

  if (value.authenticated == AuthState.NOT_AUTHENTICATED) {
    return children; 
  } else {
    return null;
  }
};

export const Authenticated = ({ children }) => {
  const value = React.useContext(UserContext);

  if (value.authenticated == AuthState.AUTHENTICATED) {
    return children; 
  } else {
    return null;
  }
};
