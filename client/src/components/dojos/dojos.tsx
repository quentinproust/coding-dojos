import * as React from 'react';

import { Segment, List, Icon, Step, Message, Divider, Header } from 'semantic-ui-react'

const Dojo = ({ dojo }) => {
  return (
    <Segment textAlign='center' >
      <Header as='h2' icon textAlign='center'>
        <Header.Content>{dojo.label}</Header.Content>
      </Header>
      <Segment.Inline>
        <span>
        {(dojo.subject || {}).theme}
        </span>
      </Segment.Inline>
      <Divider horizontal>
      <Header as='h4'>
        <Icon name='map marker alternate' />
        Lieu
      </Header>
    </Divider>
      <Segment.Inline>
        {dojo.location}
      </Segment.Inline>
      <Divider horizontal>
      <Header as='h4'>
        <Icon name='calendar alternate' />
        Date
      </Header>
    </Divider>
      <Segment.Inline>
        {dojo.date}
      </Segment.Inline>
    </Segment>


  )
}

export default Dojo;
