import * as React from 'react';


import { Segment, List, Icon, Step, Message, Divider, Header } from 'semantic-ui-react'

const Stepper = ({ step }) => {

  console.log("lastep:" + step)
  let myindex = ["Canceled", "Proposed", "PollInProgress", "Scheduled", "Done"].indexOf(step)

  if (myindex === -1) return (
    <Message warning>
      <Message.Header>Le statut de ce dojo semble être dans un monde parallèle... Non non ce n'est pas un bug, c'est une feature aléatoire. ;-)</Message.Header>
    </Message>
  )


  if (myindex === 0) return (
    <Message warning>
      <Message.Header>Le Dojo a été annulé car les Serliens devait aller regler le problème de Godzilla</Message.Header>
    </Message>
  )
  const getstatutEtape = (index, noEtape) => {
    if (index === noEtape) return true
    return false

  }

  return (
    <Step.Group size="tiny" fluid stackable='tablet'>
      <Step {...(getstatutEtape(myindex, 1) ? { active: true } : { disabled: true })} >
        <Icon name='save outline' />
        <Step.Content>
          <Step.Title>Proposé</Step.Title>
        </Step.Content>
      </Step>
      <Step {...(getstatutEtape(myindex, 2) ? { active: true } : { disabled: true })}>
        <Icon name='question circle' />
        <Step.Content>
          <Step.Title>Planification en cours</Step.Title>
        </Step.Content>
      </Step>
      <Step {...(getstatutEtape(myindex, 3) ? { active: true } : { disabled: true })}>
        <Icon name='calendar alternate' />
        <Step.Content>
          <Step.Title>Planifié</Step.Title>
        </Step.Content>
      </Step>
      <Step {...(getstatutEtape(myindex, 4) ? { active: true } : { disabled: true })}>
        <Icon name='certificate' />
        <Step.Content>
          <Step.Title>Effectué</Step.Title>
        </Step.Content>
      </Step>

    </Step.Group>
  )

}

const GiveMeTheDate = ({ dojo }) => {
  let statusIndex = ["Canceled", "Proposed", "PollInProgress", "Scheduled", "Done"].indexOf(dojo.status)
  if (statusIndex < 0) return <>N/A</>
  if (statusIndex < 2) return <>Un sondage sera bientôt disponible</>
  if (statusIndex === 2) return <><a target="blank" href={dojo.poll.datePollUrl}>Répondez au sondage</a> </>
  return <>{dojo.date && dojo.date}{!dojo.date && 
    <Message error
    content={`Oups aucune date n'a été spécifiée.`}
  />}</>
}

const GiveMeTheSubject = ({ subject }) => {

  return (
    <>
      {!subject && (
        <Message
          icon='meh'
          content={`Le sujet du dojo n'a pas encore été sélectionné. Pensez à voter pour les sujets.`}
        />
      )}
      {subject && (
        <>
          Le theme du CodingDojo est <br/>
          <Header as='h3'><Icon name="terminal"/>{subject.theme}</Header>
        
          <br/>
        </>
      )}
    </>
  )
}



const Dojo = ({ dojo }) => {
  return (
    <Segment textAlign='center' >
      <Header as='h2' icon textAlign='center'>
        <Header.Content>{dojo.label}</Header.Content>
      </Header>
      <Segment.Inline>
        <GiveMeTheSubject subject={dojo.subject} />
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
        <GiveMeTheDate dojo={dojo} />

      </Segment.Inline>
      <Stepper step={dojo.status}></Stepper>
    </Segment>


  )
}

export default Dojo;
