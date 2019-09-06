import * as React from 'react';
import { WithUser, Anonymous, Authenticated } from './user/WithUser';
import { UserInfo } from './user/UserInfo';
import { DojoList, NewDojoForm } from './dojos';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import {
  Container,
  Menu,
  Icon,
  Image,
} from 'semantic-ui-react'
import StartSchedule from './dojos/StartSchedule';

export const App = () => {
  return (
    <Router>
      <WithUser>
        <div>
          <Menu fixed='top' inverted style={{ backgroundColor: '#1768b1' }}>
            <Container>
              <Menu.Item header>
                <Image src='https://www.serli.com/wp-content/themes/serli/dist/images/main-logo.png' size='small' style={{ marginRight: 10 }} />
                <Icon name='lab' /> Coding Dojos
              </Menu.Item>
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
            <Authenticated>
              <Route path="/dojos/new" exact component={NewDojoForm} />
              <Route path="/dojos/:dojoId/link_date_poll" component={StartSchedule} />
            </Authenticated>
          </Container>
        </div>
      </WithUser>
    </Router>
  );
}
