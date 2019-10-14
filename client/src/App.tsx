import * as React from 'react';
import { WithUser, Anonymous, Authenticated, WithRole } from './user/WithUser';
import { UserInfo } from './user/UserInfo';
import { RoleBasedRoute } from './routing';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import {
  Container,
  Menu,
  Icon,
  Image,
} from 'semantic-ui-react'
import HomeWrapper from './pages/HomeWrapper';
import AdminWrapper from './pages/admin/AdminWrapper';
import { WithErrors } from './errors/WithErrors';

export const App = () => {
  return (
    <Router>
      <WithUser>
        <WithErrors>
          <div>
            <Menu fixed='top' inverted style={{ backgroundColor: '#1768b1' }}>
              <Container>
                <Menu.Item header>
                  <Image src='https://www.serli.com/wp-content/themes/serli/dist/images/main-logo.png' size='small' style={{ marginRight: 10 }} />
                  <Icon name='lab' /> Coding Dojos
              </Menu.Item>
                <Menu.Item as={Link} to="/">Home</Menu.Item>
                <WithRole role="ADMIN">
                  <Menu.Item as={Link} to="/admin">Admin</Menu.Item>
                </WithRole>
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
            <Container style={{ marginTop: '7em' }}>
              <Route path="/" exact component={HomeWrapper} />
              <RoleBasedRoute path="/admin" role="ADMIN" component={AdminWrapper} />
            </Container>
          </div>
        </WithErrors>
      </WithUser>
    </Router>
  );
}
