import * as React from 'react';
import axios from 'axios';
import uuid from "uuid";
import { Segment, Button, Card, List, Grid, Icon, Step, Message, Item } from 'semantic-ui-react'

import { UserContext, AuthState } from '../user/UserContext';

import Dojo from '../components/dojos/dojos'


/****** SERVICE */

const getListSubject = () => {
  return axios.get(`/api/subjects`)
    .then((response) => {
      return response.data;
    });
}

const getListDojo = () => {
  return axios.get(`/api/dojos`)
    .then((response) => {
      return response.data;
    });
}


/*********** */


const toggleVote2 = (id) => {
  return axios.post(`/api/subjects/${id}/interest`)
    .then((response) => {
      return response.data;
    });
}


const ListSubject = ({ subjects, toggleVote, yourSub }) => {
  return (
    <List divided verticalAlign='middle'>
      {subjects.map(subject =>
        <Subject key={subject.id} subject={subject} toggleVote={toggleVote} yourSub={yourSub}/>)}
    </List>
  )
}

const Subject = ({ subject, toggleVote, yourSub }) => {
  return (
    <List.Item>
      <List.Content floated='right'>
        <Button
          color={ subject.interested.includes(yourSub) ? 'green' : 'grey'}
          icon={'thumbs up outline'}
          onClick={() => toggleVote(subject.id)}
          label={{ basic: true, color:  subject.interested.includes(yourSub) ? 'green' : 'grey', pointing: 'left', content: subject.interested.length }}
        />
      </List.Content>

      <List.Content>{subject.theme} </List.Content>

    </List.Item>
  )
}



export default () => {

  const [subjects, setSubjects] = React.useState([]);
  const [dojos, setDojos] = React.useState([]);
  const [errors, setErrors] = React.useState([]);
  const [reloadplease, setreloadplease] = React.useState(true);
  const { authenticated, user } = React.useContext(UserContext);


  const toggleVote = (id) => {
    toggleVote2(id)
      .then(response =>
        setreloadplease(!reloadplease) // TODO c'est degueu
      )

  }

  const handleDismiss = (id) => {
      setErrors(errors.filter(error => error.id !==id))
  }


  React.useEffect(() => {
    getListSubject()
      .then(listeSubject => {
        setSubjects(listeSubject)
        console.log('getListSubject - je met des Subjects ')
      }
      ).catch( error =>
          {
            let newErrors = errors
            newErrors.push( {"id":uuid.v4(),"target":"subject","color":"red", "message": "Argh, on a un raté sur la récupération de sujets de dojos ! Bouger pas, on envoie un gars gratter le problème !"})
            setErrors(newErrors)
          }
      )
  }, [reloadplease]);

  React.useEffect(() => {
    getListDojo()
      .then(listeDojo =>
        setDojos(listeDojo)
        ).catch( error =>
          {
            let newErrors = errors
            newErrors.push( {"id":uuid.v4(),"target":"dojo","color":"red", "message": "Argh, on a un raté sur la récupération du Dojo ! Bouger pas, on envoie un gars gratter le problème !"})
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
        errors.map( myError => 
          <Message
           key=  {myError.id}
           header="Diantre !!! "
           onDismiss={ e => handleDismiss(myError.id)}
           icon='times'
           color="red"
           content= {myError.message}
         />)
         
       )}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>

      {authenticated == AuthState.AUTHENTICATED? 
      <>
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
       {dojo && (
         <Segment>
           <ListSubject subjects={subjects} toggleVote={toggleVote} yourSub={user.sub} />
         </Segment>
       )}
       {!dojo && (
         <Message
           icon='meh'
           content={`Pas de sujets de dojo pour le moment. D'autres sujets arriveront bientôt ...`}
         />
       )}
     </Grid.Column>
     </>
      
      :
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
      }

       
      </Grid.Row>
    </Grid>
  )
}
