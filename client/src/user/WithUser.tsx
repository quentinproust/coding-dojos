import * as React from 'react';
import { UserService } from './UserService';
import { UserContext, UserContextData } from './UserContext';

export const WithUser = ({ children }) => {
  const [contextState, setContext] = React.useState<UserContextData>({
    authenticated: false,
  });

  const setUser = user => {
    if (user) {
      setContext({
        authenticated: true,
        user: user
      })
    } else {
      setContext({
        authenticated: false,
      });
    }
  }

  React.useEffect(() => {
    const userService = new UserService();
    userService.loadAuthenticatedUser()
      .then(user => {
        setContext({
          authenticated: user.authenticated,
          user: user
        });
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

  if (!value.authenticated) {
    return children; 
  } else {
    return null;
  }
};

export const Authenticated = ({ children }) => {
  const value = React.useContext(UserContext);

  if (value.authenticated) {
    return children; 
  } else {
    return null;
  }
};
