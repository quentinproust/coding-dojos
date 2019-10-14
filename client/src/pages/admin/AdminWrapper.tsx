import * as React from 'react';
import { Header, Menu, Grid } from 'semantic-ui-react'
import { Link, useRouteMatch, Route } from 'react-router-dom';

import SubjectsPage from './SubjectWrapper';
import DojosPage from './DojoWrapper';
import SubjectFormWrapper from './SubjectFormWrapper';
import DojoFormWrapper from './DojoFormWrapper';

export default () => {
  const { params: { activeItem } } = useRouteMatch("/admin/:activeItem") || { params: { activeItem: 'subjects' } };

  return (
    <Grid columns={2}>
      <Grid.Row>
        <Grid.Column width="4">
          <Menu vertical>
            <Menu.Item as={Link} to="/admin/subjects" active={activeItem === 'subjects'}>Subjects</Menu.Item>
            <Menu.Item as={Link} to="/admin/dojos" active={activeItem === 'dojos'}>Dojos</Menu.Item>
          </Menu>
        </Grid.Column>
        <Grid.Column>
          <Route path="/admin" exact component={SubjectsPage} />
          <Route path="/admin/subjects" exact component={SubjectsPage} />
          <Route path="/admin/subjects/new" exact component={SubjectFormWrapper} />
          <Route path="/admin/subjects/:id/edit" exact component={SubjectFormWrapper} />
          <Route path="/admin/dojos" exact component={DojosPage} />
          <Route path="/admin/dojos/new" exact component={DojoFormWrapper} />
          <Route path="/admin/dojos/:id/edit" exact component={DojoFormWrapper} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
