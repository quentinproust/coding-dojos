import * as React from 'react';
import axios from 'axios';

import { Segment, Button, Card, List, Grid } from 'semantic-ui-react'

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


const ListSubject = ({ subjects, toggleVote }) => {
    return (
        <List divided verticalAlign='middle'>
            {subjects.map(subject =>
                <Subject key={subject.id} subject={subject} toggleVote={toggleVote} />)}
        </List>
    )
}

const Subject = ({ subject, toggleVote }) => {
    return (
        <List.Item>
            <List.Content floated='right'>
            <Button
        color='green'
        icon={ 'thumbs up outline'}
        onClick={() => toggleVote(subject.id)}
        label={{ basic: true, color: 'green', pointing: 'left', content: subject.interested.length }}
      />
            </List.Content>

            <List.Content>{subject.theme} </List.Content>

        </List.Item>
    )
}

const Dojo = ({dojo}) => {
    return (
 
         <Card fluid>
         <Card.Content>
           <Card.Header>{dojo.label}</Card.Header>
           <Card.Meta>{dojo.location}</Card.Meta>
           <Card.Description>
             {! dojo.subject && (
                 <p>Pas de sujet défini, penser à voter </p>
             )}  
             
           </Card.Description>
         </Card.Content>
       </Card>
    )
}


export default () => {

    const [subjects, setSubjects] = React.useState([]);
    const [dojos, setDojos] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [reloadplease, setreloadplease] = React.useState(true);

    const toggleVote = (id) => {
        toggleVote2(id)
        .then ( response =>
            setreloadplease(!reloadplease) // TODO c'est degueu
            )
        
    }

    React.useEffect(() => {
        getListSubject()
            .then(listeSubject =>            
                setSubjects(listeSubject)
            )
    }, [reloadplease]);

    React.useEffect(() => {
        getListDojo()
            .then(listeDojo =>
                setDojos(listeDojo)
            )
    }, []);
    
    const dojo = dojos[0];
    return (
        <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
              {dojo && (
                  <Dojo dojo={dojo} />
              )}
              {!dojo && (
                  <Segment>Pas de dojo prévu</Segment>
              )}
              
          </Grid.Column>
          <Grid.Column width={6}>
          <Segment><ListSubject subjects={subjects} toggleVote={toggleVote} /></Segment>
          </Grid.Column>
        </Grid.Row>
        </Grid>

        
    )
}