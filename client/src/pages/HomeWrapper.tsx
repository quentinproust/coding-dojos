import * as React from 'react';
import uuid from "uuid";
import { Segment, Grid, Message, Header } from 'semantic-ui-react'

import { ErrorContext } from '../errors/ErrorContext';
import Dojo from '../components/dojos/Dojos'
import CurrentDojo from '../components/dojos/CurrentDojo'
import ListSubject from '../components/subjects/subjects';
import { Authenticated, Anonymous } from '../user/WithUser';
import { useServices } from '../services';

import logo from '../img/logo.png';

export default () => {

  const { pushError } = React.useContext(ErrorContext);
  const [subjects, setSubjects] = React.useState([]);
  const [dojos, setDojos] = React.useState([]);

  const actions = useServices(s => ({
    toggleInterest: s.subjectService.toggleInterest,
    getListSubject: s.subjectService.list,
    getListDojo: s.dojoService.list,
  }));

  const toggleVote = (id) => {
    actions.toggleInterest(id)
      .then(response => {
        let index = subjects.findIndex(subject => subject.id === id)
        if (index === -1) {
          console.log('could not find subject with id ' + id);
          pushError('subject', 'Erreur lors de l\'ajout du vote');
        } else {
          subjects.splice(index, 1, response)
          setSubjects([...subjects])
        }
      })
  }

  React.useEffect(() => {
    actions.getListSubject()
      .then(listeSubject => {
        setSubjects(listeSubject)
      }).catch(error => {
        console.log(error);
        pushError('subject', 'Argh, on a un raté sur la récupération de sujets de dojos ! Bouger pas, on envoie un gars gratter le problème !');
      })
  }, []);

  React.useEffect(() => {
    actions.getListDojo()
      .then(listeDojo =>
        setDojos(listeDojo)
      ).catch(error => {
        console.log(error);
        pushError('dojo', 'Argh, on a un raté sur la récupération du Dojo ! Bouger pas, on envoie un gars gratter le problème !');
      }
      )
  }, []);

  const dojo = dojos[0];
  return (
    <Grid stackable >
      <Grid.Row>
        <Grid.Column width={10}>
          <Header as='h2'>Le prochain dojo</Header>
          {dojo && (
            <CurrentDojo dojo={dojo} />
          )}
          {!dojo && (
            <Message
              icon='meh'
              content='Pas de dojo prévu pour le moment.'
            />
          )}
          {dojos.slice(1).length > 0 && (
            <>
              <Header as='h2'>Précédents dojos</Header>
              {dojos.slice(1).map(d => (
                <Dojo key={d.id} dojo={d} />
              ))}
            </>
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <Header as='h2'>Les idées de sujet</Header>
          {subjects.length > 0 && (
            <Segment>
              <ListSubject subjects={subjects} toggleVote={toggleVote} />
            </Segment>
          )}
          {subjects.length == 0 && (
            <Message
              icon='meh'
              content={`Pas de sujets de dojo pour le moment. D'autres sujets arriveront bientôt ...`}
            />
          )}
          <img src={logo} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
