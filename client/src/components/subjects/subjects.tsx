import * as React from 'react';
import { List, Button, Popup, Image } from 'semantic-ui-react';
import { UserContext } from '../../user/UserContext';

const ListSubject = ({ subjects, toggleVote }) => {
  return (
    <List divided verticalAlign='middle'>
      {subjects.map(subject =>
        <SubjectItem key={subject.id} subject={subject} toggleVote={toggleVote} />)}
    </List>
  )
}


const ListIntertedPers = ({interested}) => {
  return <>
  {interested.map(person =>
    <Popup trigger={<Image src={'https://i.pravatar.cc/' + person} avatar />} flowing hoverable>
      {person}
    </Popup>

  )}
  </>
}



const SubjectItem = ({ subject, toggleVote }) => {
  const { user: { sub: yourSub } } = React.useContext(UserContext);

  return (
    <List.Item>
      <List.Content floated='right'>
        <Button
          color={subject.interested.includes(yourSub) ? 'green' : 'grey'}
          icon={'thumbs up outline'}
          onClick={() => toggleVote(subject.id)}
          label={{ basic: true, color: subject.interested.includes(yourSub) ? 'green' : 'grey', pointing: 'left', content: subject.interested.length }}
        />
      </List.Content>
      <List.Content>{subject.theme} </List.Content>

      <List.Content><ListIntertedPers interested={subject.interested}/></List.Content>
    </List.Item>
  )
}

export default ListSubject;
