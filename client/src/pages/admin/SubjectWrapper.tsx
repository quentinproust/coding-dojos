import * as React from 'react';
import { Button, Table, Label, Icon, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { useServices } from '../../services';
import SubjectInterrestedCoders from '../../components/subjects/SubjectInterrestedCoders';

const CodersModal = ({ coders }) => (
  <Modal closeIcon trigger={<Button icon='users' />}>
    <Modal.Header>Les coders intéressés</Modal.Header>
    <Modal.Content image>
      <SubjectInterrestedCoders coders={coders} />
    </Modal.Content>
  </Modal>
)

export default () => {
  const [subjects, setSubjects] = React.useState([]);

  const actions = useServices(s => ({
    getListSubject: s.subjectService.list
  }));

  React.useEffect(() => {
    actions.getListSubject()
      .then(listeSubject => {
        setSubjects(listeSubject)
      }
      ).catch(error => {
        // FIXME no error handling
      }
      )
  }, []);

  return (
    <>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Nom du sujet</Table.HeaderCell>
            <Table.HeaderCell>Actif</Table.HeaderCell>
            <Table.HeaderCell>Interressés</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {subjects.map(s => (
            <Table.Row key={s.id}>
              <Table.Cell>{s.theme}</Table.Cell>
              <Table.Cell>{s.active ? <Icon name="check circle outline" /> : <Icon name="circle outline" />}</Table.Cell>
              <Table.Cell><Label color="green">{s.interested.length}</Label></Table.Cell>
              <Table.Cell>
                <Button.Group>
                  <Button icon='edit' as={Link} to={`/admin/subjects/${s.id}/edit`} />
                  <CodersModal coders={s.interested} />
                </Button.Group>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Button as={Link} to="/admin/subjects/new">Ajouter un sujet</Button>
    </>
  );
};
