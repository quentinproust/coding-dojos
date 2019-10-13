import * as React from 'react';
import { Button, Table, Label, Icon, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { useServices } from '../../services';
import { Dojo } from '../../services/model';

const DatePollPresenter = ({ poll }) => {
  if (!poll) return null;
  return <>{poll.adminDatePollUrl} - {poll.datePollUrl}</>
}

export default () => {
  const [dojos, setDojos] = React.useState<Dojo[]>([]);

  const actions = useServices(s => ({
    getListDojos: s.dojoService.list
  }));

  React.useEffect(() => {
    actions.getListDojos()
      .then(listeDojos => {
        setDojos(listeDojos)
      })
      .catch(error => {
        // FIXME no error handling
      })
  }, []);

  return (
    <>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Nom du dojo</Table.HeaderCell>
            <Table.HeaderCell>Sujet</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Lieu</Table.HeaderCell>
            <Table.HeaderCell>Poll</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {dojos.map(d => (
            <Table.Row key={d.id}>
              <Table.Cell>{d.label}</Table.Cell>
              <Table.Cell>{(d.subject || {}).theme}</Table.Cell>
              <Table.Cell>{d.status}</Table.Cell>
              <Table.Cell>{d.date}</Table.Cell>
              <Table.Cell>{d.location}</Table.Cell>
              <Table.Cell><DatePollPresenter poll={d.poll} /></Table.Cell>
              <Table.Cell>
                <Button.Group>
                  <Button icon='edit' as={Link} to={`/admin/dojos/${d.id}/edit`} />
                </Button.Group>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Button as={Link} to="/admin/dojos/new">Ajouter un dojo</Button>
    </>
  );
};
