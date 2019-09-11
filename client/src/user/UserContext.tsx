import * as React from 'react';
import { User } from './UserService';

export enum AuthState {
  PENDING,
  AUTHENTICATED,
  NOT_AUTHENTICATED
}

export interface UserContextData {
  authenticated: AuthState,
  user?: User
}

export interface UserContextHandle {
  setUser: (user: User) => void,
}

export const UserContext = React.createContext<UserContextData & UserContextHandle>({
  authenticated: AuthState.PENDING,
  user: null,
  setUser: (_) => { },
});
