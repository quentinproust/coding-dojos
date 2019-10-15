import * as React from 'react';
import { List, Button, Popup, Image } from 'semantic-ui-react';
import { UserContext } from '../../user/UserContext';
import { Authenticated } from '../../user/WithUser';

const ListSubject = ({ subjects, toggleVote }) => {
  return (
    <List divided verticalAlign='middle'>
      {subjects.map(subject =>
        <SubjectItem key={subject.id} subject={subject} toggleVote={toggleVote} />)}
    </List>
  )
}


const ListIntertedPers = ({ interested }) => {
  console.log("interested", interested);
  return <>
    {interested.map(person =>
      <Popup key={person.sub} trigger={<Image src={getImage(person)} avatar />} flowing hoverable>
        {person.name}
      </Popup>

    )}
  </>
}

function getImage(person) {
  if (person.picture) {
    return person.picture;
  } else {
    return `https://ui-avatars.com/api/?background=00ADBA&color=ffffff&rounded=true&name=${person.name}`;
  }
}

const SubjectItem = ({ subject, toggleVote }) => {
  return (
    <List.Item>
      <Authenticated>
        <List.Content floated='right'>
          <InterestedButton subject={subject} toggleVote={toggleVote} />
        </List.Content>
      </Authenticated>

      <List.Content>{subject.theme} </List.Content>

      <List.Content><ListIntertedPers interested={subject.interested} /></List.Content>
    </List.Item>
  )
}

const InterestedButton = ({ subject, toggleVote }) => {
  const { user: { sub: yourSub } } = React.useContext(UserContext);

  const hasVoted = subject.interested.some(i => i.sub === yourSub);

  return (
    <Button
      color={hasVoted ? 'green' : 'grey'}
      icon={'thumbs up outline'}
      onClick={() => toggleVote(subject.id)}
      label={{ basic: true, color: hasVoted ? 'green' : 'grey', pointing: 'left', content: subject.interested.length }}
    />
  );
}

export default ListSubject;
