import * as React from 'react';
import { WithUser, Anonymous, Authenticated } from './user/WithUser';
import { UserInfo } from './user/UserInfo';
import { DojoList, NewDojoForm } from './dojos';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import {
  Container,
  Menu,
} from 'semantic-ui-react'

export const App = () => {
  return (
    <Router>
      <WithUser>
        <div>
          <Menu fixed='top' inverted>
            <Container>
              <Menu.Item header>Condig Dojos</Menu.Item>
              <Menu.Item as={Link} to="/">Home</Menu.Item>
              <Anonymous>
                <Menu.Item position='right' as='a' href="/oauth2/authorization/google">
                  Login
                </Menu.Item>
              </Anonymous>
              <Authenticated>
                <Menu.Item position='right'>
                  <UserInfo />
                </Menu.Item>
                <Menu.Item as='a' href="/logout">
                  Logout
                </Menu.Item>
              </Authenticated>
            </Container>
          </Menu>
          <Container text style={{ marginTop: '7em' }}>
            <Route path="/" exact component={DojoList} />
            <Route path="/dojos/new" exact component={NewDojoForm} />
          </Container>
        </div>
      </WithUser>
    </Router>
  );
}
