import * as React from 'react';
import uuid from "uuid";
import { Segment, Grid, Message } from 'semantic-ui-react'

import Dojo from '../components/dojos/dojos'
import ListSubject from '../components/subjects/subjects';
import { Authenticated, Anonymous } from '../user/WithUser';
import { useServices } from '../services';


export default () => {

  const [subjects, setSubjects] = React.useState([]);
  const [dojos, setDojos] = React.useState([]);
  const [errors, setErrors] = React.useState([]);
  
  const actions = useServices(s => ({
    toggleInterest: s.subjectService.toggleInterest,
    getListSubject: s.subjectService.list,
    getListDojo: s.dojoService.list,
  }));

  const toggleVote = (id) => {
    actions.toggleInterest(id)
      .then(response =>
        {
        let index = subjects.findIndex(subject => subject.id === id  )
        if ( index === -1) {
          console.log("ERROR", "TODO A GERER !")
        }else{
          subjects.splice(index, 1, response)
          setSubjects( [...subjects]) 
        }
      }
      )

  }

  const handleDismiss = (id) => {
    setErrors(errors.filter(error => error.id !== id))
  }

  React.useEffect(() => {
    actions.getListSubject()
      .then(listeSubject => {
        setSubjects(listeSubject)
      }
      ).catch(error => {
        let newErrors = errors
        newErrors.push({ "id": uuid.v4(), "target": "subject", "color": "red", "message": "Argh, on a un raté sur la récupération de sujets de dojos ! Bouger pas, on envoie un gars gratter le problème !" })
        setErrors(newErrors)
      }
      )
  }, []);

  React.useEffect(() => {
    actions.getListDojo()
      .then(listeDojo =>
        setDojos(listeDojo)
      ).catch(error => {
        let newErrors = errors
        newErrors.push({ "id": uuid.v4(), "target": "dojo", "color": "red", "message": "Argh, on a un raté sur la récupération du Dojo ! Bouger pas, on envoie un gars gratter le problème !" })
        setErrors(newErrors)
      }
      )
  }, []);

  const dojo = dojos[0];
  return (
    <Grid stackable >
      <Grid.Row>
        <Grid.Column width={16}>
          {errors && (
            errors.map(myError =>
              <Message
                key={myError.id}
                header="Diantre !!! "
                onDismiss={e => handleDismiss(myError.id)}
                icon='times'
                color="red"
                content={myError.message}
              />)

          )}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>

        <Authenticated>
          <Grid.Column width={10}>
            {dojo && (
              <Dojo dojo={dojo} />
            )}
            {!dojo && (
              <Message
                icon='meh'
                content='Pas de dojo prévu pour le moment.'
              />
            )}

          </Grid.Column>
          <Grid.Column width={6}>
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
          </Grid.Column>
        </Authenticated>
        <Anonymous>
          <Grid.Column width={16}>
            {dojo && (
              <Dojo dojo={dojo} />
            )}
            {!dojo && (
              <Message
                icon='meh'
                content='Pas de dojo prévu pour le moment.'
              />
            )}

          </Grid.Column>
        </Anonymous>


      </Grid.Row>
    </Grid>
  )
}
