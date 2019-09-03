import * as React from 'react';
import { User } from './UserService';

export interface UserContextData {
  authenticated: boolean
  user?: User
}

export interface UserContextHandle {
  setUser: (user: User) => void,
}

export const UserContext = React.createContext<UserContextData & UserContextHandle>({
  authenticated: false,
  user: null,
  setUser: (_) => { },
});
