import * as React from 'react';


import { Segment, Button, Card, List, Grid, Icon, Step, Message, Item } from 'semantic-ui-react'

const Stepper = ({ step }) => {

    console.log("lastep:"+step)
    let myindex = ["Canceled","Proposed","PollInProgress","Scheduled","Done"].indexOf(step)
  
    if (myindex === -1 ) return (
      <Message warning>
        <Message.Header>Le statut de ce dojo semble être dans un monde parallèle... Non non ce n'est pas un bug, c'est une feature aléatoire. ;-)</Message.Header>
      </Message>
    )
  
  
    if (myindex === 0 ) return (
      <Message warning>
        <Message.Header>Le Dojo a été annulé car les Serliens devait aller regler le problème de Godzilla</Message.Header>
      </Message>
    )
      const getstatutEtape = (index,noEtape) => {
        console.log("index"+index,"noEtape"+noEtape )
        if (index === noEtape) return true
        return false
  
      }
  
    return (
      <Step.Group size="tiny" fluid stackable='tablet'>
      <Step {...(getstatutEtape(myindex,1)? {active:true} : {disabled:true} )} >
      <Icon name='save outline' />
        <Step.Content>
          <Step.Title>Proposed </Step.Title>
        </Step.Content>
      </Step>
      <Step {...(getstatutEtape(myindex,2)? {active:true} : {disabled:true})}>
      <Icon name='question circle' />
        <Step.Content>
          <Step.Title>PollInProgress</Step.Title>
        </Step.Content>
      </Step>
      <Step {...(getstatutEtape(myindex,3)? {active:true} : {disabled:true})}>
      <Icon name='calendar alternate' />
        <Step.Content>
          <Step.Title>Sheduled</Step.Title>
        </Step.Content>
      </Step>
      <Step {...(getstatutEtape(myindex,4)? {active:true} : {disabled:true})}>
      <Icon name='certificate' />
        <Step.Content>
          <Step.Title>Done</Step.Title>
        </Step.Content>
      </Step>
  
    </Step.Group>
    )
  
  }
  
  const GiveMeTheDate = ({dojo})  => {
  
    let statusIndex = ["Canceled","Proposed","PollInProgress","Scheduled","Done"].indexOf(dojo.status)
    if (statusIndex < 0 ) return <>N/A</> 
    if (statusIndex < 2 ) return <>Un sondage sera bientôt disponible</> 
    if (statusIndex === 2  ) return <><a target="blank" href={dojo.poll.datePollUrl}>Répondez au sondage</a> </>
    return <>{dojo.date}</>
  }
  

  
  const Dojo = ({ dojo }) => {
    return (
  <Segment>
          <Item>
        
        <Item.Content>
          <Item.Header><h2>{dojo.label}</h2></Item.Header>
          <Item.Meta>{!dojo.subject && (
              <Message
                icon='meh'
                content={`Le sujet du dojo n'a pas encore été sélectionné. Pensez à voter pour les sujets.`}
              />
            )}</Item.Meta>
          <List>
              <List.Item>
                <List.Icon name='marker' />
                <List.Content>{dojo.location}</List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='calendar' />
                <List.Content>
               <GiveMeTheDate dojo={dojo}/>
                </List.Content>
              </List.Item>
              
            </List>                                             
          <Item.Extra> </Item.Extra>
        </Item.Content>
      </Item>
      <Stepper step={dojo.status}></Stepper>
    </Segment>
    )
  }

export default Dojo;
