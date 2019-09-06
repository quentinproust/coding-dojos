import * as React from 'react';
import axios from 'axios';
import { Authenticated, Anonymous } from '../user/WithUser';
import { UserContext, UserContextData } from '../user/UserContext';

import { Link } from 'react-router-dom';
import { List, Segment, Divider, Button, Message, Container } from 'semantic-ui-react';

const Interested = ({ dojo, saveInterest }) => {
  const upvoteCount = dojo.interested.filter(i => i.interested).length;
  const downvoteCount = dojo.interested.filter(i => !i.interested).length;

  const { authenticated, user }: UserContextData = React.useContext(UserContext);

  const currentUserVote = authenticated ? dojo.interested.filter(i => i.name == user.name) : [];
  const up = currentUserVote.length == 1 && currentUserVote[0].interested;
  const down = currentUserVote.length == 1 && !currentUserVote[0].interested;

  return (
    <div>
      <Button
        color='green'
        content='Intéressé'
        icon={up ? 'thumbs up' : 'thumbs up outline'}
        onClick={() => saveInterest(true)}
        label={{ basic: true, color: 'green', pointing: 'left', content: upvoteCount }}
      />
      <Button
        style={{ marginTop: 10 }}
        content='Pas intéressé'
        icon={down ? 'thumbs down' : 'thumbs down outline'}
        onClick={() => saveInterest(false)}
        label={{ basic: true, pointing: 'left', content: downvoteCount }}
      />
    </div>
  );
};

const States = ({ dojo }) => {
  if (dojo.status === 'Proposed') {
    return <ScheduleDojoButton dojo={dojo} />;
  } else if (dojo.status === 'PollInProgress') {
    return <ShowPollButton dojo={dojo} />
  }
  return null;
};

const ScheduleDojoButton = ({ dojo }) => {
  return (
    <Message>
      <Container>Ce dojo n'est pas encore planifié</Container>
      <Authenticated>
        <Button
          icon='clock outline'
          style={{ marginTop: 10 }}
          content='Planifier'
          as={Link}
          to={`/dojos/${dojo.id}/link_date_poll`}
        />
      </Authenticated>
    </Message>
  );
};

const ShowPollButton = ({ dojo }) => {
  return (
    <Message>
      <Container>
        Un sondage est en cours afin de planifier ce dojo. 
        Vous pouvez ajouter vos disponibilités en cliquant sur le bouton ci-dessous :
      </Container>
      <Authenticated>
        <Button
          icon='chart bar outline'
          style={{ marginTop: 10 }}
          content='Répondre au sondage'
          as='a'
          href={dojo.poll.externalDatePoll}
        />
      </Authenticated>
    </Message>
  );
};

const DojoItem = ({ dojo, saveInterest }) => {
  return (
    <List.Item>
      <List.Content>
        <Segment basic padded>
          <List.Header>{dojo.theme} | {dojo.location}</List.Header>
          <List.Description>
            <Interested
              dojo={dojo}
              saveInterest={interest => saveInterest(dojo, interest)}
            />
            <States dojo={dojo} />
          </List.Description>
        </Segment>
      </List.Content>
    </List.Item>
  );
};

export default () => {

  const [dojos, setDojos] = React.useState([]);
  const [error, setError] = React.useState(null);

  const saveInterest = (dojo, interested) => {
    axios.post(`http://localhost:8080/api/dojos/${dojo.id}/interests`, { interested })
      .then(loadDojos)
      .then((response) => {
        console.log(response);
        setDojos(response.data);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  };

  const loadDojos = () => {
    return axios.get('http://localhost:8080/api/dojos')
      .then((response) => {
        console.log(response);
        setDojos(response.data);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  };

  React.useEffect(() => {
    loadDojos()
  }, []);

  console.log({ dojos });

  return (
    <>
      <Divider horizontal>Liste des Dojos</Divider>
      <Anonymous>
        <Message>Aucun dojo ci-dessous ne vous intéresse ? Connecter vous afin de proposer un prochain dojo !</Message>
      </Anonymous>
      <Authenticated>
        <Message>
          <Container>Aucun dojo ci-dessous ne vous intéresse ? </Container>
          <Button primary style={{ marginTop: 10 }} as={Link} to="/dojos/new">Proposer un Dojo</Button>
        </Message>
      </Authenticated>

      <Segment vertical>
        <List divided relaxed>
          {dojos.map(dojo => (
            <DojoItem key={dojo.id} dojo={dojo} saveInterest={saveInterest} />
          ))}
        </List>
      </Segment>
    </>
  );
}
