import * as React from 'react';
import { List, Image } from 'semantic-ui-react';
import { Coder } from '../../services/model';

export default ({ coders }) => {
  return (
    <List>
      {coders.map(coder => (
        <List.Item key={coder.sub}>
          <Image avatar src={coder.picture} />
          <List.Content>
            <List.Header>{coder.name}</List.Header>
            <List.Description>{coder.email}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
}
