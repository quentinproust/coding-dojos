import * as React from 'react';
import axios from 'axios';

import { Divider, Input, Button, Segment, Form } from 'semantic-ui-react';

export default () => {
  const [theme, setTheme] = React.useState("");
  const [location, setLocation] = React.useState("");

  const saveNewDojo = () => {
    axios.post('/api/dojos', {
      theme,
      location,
    })
      .then((response) => {
        console.log(response);
        window.location.assign('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Divider horizontal>Liste des Dojos</Divider>
      <Form size='large'>
        <Segment stacked>
          <Form.Input fluid icon='hashtag' iconPosition='left' placeholder='Thème' value={theme} onChange={e => setTheme(e.target.value)} />
          <Form.Input fluid icon='map marker' iconPosition='left' placeholder='Lieu' value={location} onChange={e => setLocation(e.target.value)} />
          <Button primary onClick={saveNewDojo}>Enregistrer</Button>
        </Segment>
      </Form>
    </>
  );
}
