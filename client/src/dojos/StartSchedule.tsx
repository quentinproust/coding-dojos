import * as React from 'react';
import axios from 'axios';

import { List, Segment, Divider, Button, Message, Container, Form } from 'semantic-ui-react';

export default ({ match }) => {
  const [uri, setUri] = React.useState("");

  const savePoll = () => {
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
  };

  return (
    <>
      <Divider horizontal>Planifier un dojo</Divider>
      <Segment stacked>
        <Container>
          Afin de planifier un dojo, il est nécessaire de créer un sondage.
          Vous pouvez utiliser les plateformes suivantes :
          </Container>
        <List>
          <List.Item><a href="https://framadate.org/create_poll.php?type=date">Framadate</a></List.Item>
          <List.Item><a href="https://doodle.com/create">Doodle</a></List.Item>
        </List>
        <Container>
          Une fois le sondage crée sur la plateforme choisie, enregistrer le lien vers le sondage
          dans le champs ci-dessous.
        </Container>
        <Form>
          <Form.Input fluid icon='linkify' iconPosition='left' placeholder='Lien vers le sondage' value={uri} onChange={e => setUri(e.target.value)} />
          <Button primary onClick={savePoll}>Enregistrer</Button>
        </Form>
      </Segment>
    </>
  );
}
