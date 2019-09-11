import * as React from 'react';
import axios from 'axios';

import { Segment, Divider, Button, Container, Form } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';

export default ({ match }) => {
  const [date, setDate] = React.useState("");

  /*const savePoll = () => {
    axios.post(`/api/dojos/${match.params.dojoId}/external_date_poll`, {
      uri
    })
      .then((response) => {
        console.log(response);
        window.location.assign('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };*/

  return (
    <>
      <Divider horizontal>Sélectionner une date pour le dojo</Divider>
      <Segment stacked>
        <Container>
          Le sondage est planifié.
          Saisissez la date :
        </Container>
        <Form>
          <DateInput
            inline
            name='date'
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <Button primary>Enregistrer</Button>
        </Form>
      </Segment>
    </>
  );
}
