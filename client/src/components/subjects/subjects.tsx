import * as React from 'react';
import { List, Button } from 'semantic-ui-react';
import { UserContext } from '../../user/UserContext';

const ListSubject = ({ subjects, toggleVote }) => {
  return (
    <List divided verticalAlign='middle'>
      {subjects.map(subject =>
        <SubjectItem key={subject.id} subject={subject} toggleVote={toggleVote} />)}
    </List>
  )
}

const SubjectItem = ({ subject, toggleVote }) => {
  const { user: { sub: yourSub } } = React.useContext(UserContext);

  const hasVoted = subject.interested.some(i => i.sub === yourSub);

  return (
    <List.Item>
      <List.Content floated='right'>
        <Button
          color={hasVoted ? 'green' : 'grey'}
          icon={'thumbs up outline'}
          onClick={() => toggleVote(subject.id)}
          label={{ basic: true, color: hasVoted ? 'green' : 'grey', pointing: 'left', content: subject.interested.length }}
        />
      </List.Content>

      <List.Content>{subject.theme} </List.Content>

    </List.Item>
  )
}

export default ListSubject;
