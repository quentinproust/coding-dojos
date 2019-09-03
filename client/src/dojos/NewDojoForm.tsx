import * as React from 'react';
import axios from 'axios';

import { Divider, Input, Button, Segment } from 'semantic-ui-react';

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
      <Segment>
        <Input label='Thème : ' value={theme} onChange={e => setTheme(e.target.value)} />
        <Input label='Lieu : ' value={location} onChange={e => setLocation(e.target.value)} />
        <div>
          <span>Theme : </span>
          <input type="text"  />
        </div>
        <div>
          <span>Location : </span>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <input type="button" onClick={saveNewDojo} value="Save" />
      </Segment>
    </>
  );
}
