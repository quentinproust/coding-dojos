import * as React from 'react';
import { UserContext } from './UserContext';
import { Authenticated, Anonymous } from './WithUser';
import { Icon } from 'semantic-ui-react';

const UserInfoInternal = () => {
  const value = React.useContext(UserContext);
  return (
    <span><Icon name="user" />{value.user.name}</span>
  );
}

export const UserInfo = () => {
  return (
    <>
      <Authenticated>
        <UserInfoInternal />
      </Authenticated>
      <Anonymous>
        <span>Anonymous</span>
      </Anonymous>
    </>
  );
};
