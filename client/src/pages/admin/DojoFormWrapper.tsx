import * as React from 'react';
import { Button, Input, Header, Form, Checkbox, Dropdown, Select, DropdownItemProps } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { useServices } from '../../services';
import { Subject, Dojo, DatePoll } from '../../services/model';
import { DateInput } from 'semantic-ui-calendar-react';

const statusOptions = [
  { key: 'Proposed', value: 'Proposed', text: 'Proposé' },
  { key: 'Canceled', value: 'Canceled', text: 'Annulé' },
  { key: 'Done', value: 'Done', text: 'Effectué' },
  { key: 'PollInProgress', value: 'PollInProgress', text: 'En cours de planification' },
  { key: 'Scheduled', value: 'Scheduled', text: 'Planifié' },
];

const defaultStatusOption = statusOptions[0];

export default ({ match: { params: { id: urlId } } }) => {
  const [id, setId] = React.useState("");
  const [label, setLabel] = React.useState("");
  const [status, setStatus] = React.useState<DropdownItemProps>(defaultStatusOption);
  const [subjectOpt, setSubjectOpt] = React.useState<DropdownItemProps>(null);
  const [location, setLocation] = React.useState("");
  const [date, setDate] = React.useState(null);
  const [adminPoll, setAdminPoll] = React.useState("");
  const [userPoll, setUserPoll] = React.useState("");

  const [subjects, setSubjects] = React.useState<Subject[]>([]);

  const { saveDojo, getDojo, listSubjects } = useServices(s => ({
    listSubjects: s.subjectService.list,
    saveDojo: s.dojoService.save,
    getDojo: s.dojoService.get,
  }));

  React.useEffect(() => {
    if (!urlId) return;

    getDojo(urlId)
      .then(d => {
        if (!d) return;

        setId(d.id);
        setLabel(d.label);
        setStatus(statusOptions.find(s => s.value === d.status));
        if (d.subject) {
          setSubjectOpt(({
            key: d.subject.id,
            text: d.subject.theme,
            value: d.subject.id,
          }));
        }
        setLocation(d.location);
        setDate(d.date);
        if (d.poll) {
          setAdminPoll(d.poll.adminDatePollUrl);
          setUserPoll(d.poll.datePollUrl);
        }
      })
      .catch(console.error)
  }, [urlId]);

  React.useEffect(() => {
    listSubjects().then(s => {
      setSubjects(s);
    });
  }, []);

  const handleSubmit = () => {
    const dojo = new Dojo();
    if (id) {
      dojo.id = id;
    }
    dojo.label = label;
    dojo.location = location;
    dojo.date = date;
    dojo.status = status.value;
    if (subjectOpt) {
      dojo.subject = subjects.find(s => s.id === subjectOpt.value);
    }
    if (userPoll && adminPoll) {
      dojo.poll = new DatePoll(userPoll, adminPoll);
    }

    saveDojo(dojo).then(d => {
      setId(d.id);
      setLabel(d.label);
      setStatus(statusOptions.find(s => s.value === d.status));
      if (d.subject) {
        setSubjectOpt(({
          key: d.subject.id,
          text: d.subject.theme,
          value: d.subject.id,
        }));
      }
      setLocation(d.location);
      setDate(d.date);
      if (d.poll) {
        setAdminPoll(d.poll.adminDatePollUrl);
        setUserPoll(d.poll.datePollUrl);
      }
      window.location.assign(`/admin/dojos/${d.id}/edit`)
    })
      .catch(console.error);
  };

  const dropDownSubjects = subjects.map(s => ({
    key: s.id,
    text: s.theme,
    value: s.id,
  }));

  console.log("subjectOpt", subjectOpt);

  return (
    <>
      <Header as='h1'>{!id ? 'Ajout d\'un dojo' : 'Mettre à jour un dojo'}</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Id</label>
          <Input readOnly value={id} />
        </Form.Field>
        <Form.Field>
          <label>Label</label>
          <Input placeholder='Label' value={label}
            onChange={e => setLabel(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Status</label>
          {/* FIXME status should be an enum */}
          <Select
            placeholder='Selectionner un status'
            fluid
            selection
            options={statusOptions}
            value={status.value}
            onChange={(e, data) => setStatus(statusOptions.find(s => s.value === data.value))}
          />
        </Form.Field>
        <Form.Field>
          <label>Lieu</label>
          <Input placeholder='Lieu' value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Date</label>
          <DateInput
            placeholder="Date"
            value={date || ''}
            iconPosition="left"
            onChange={(event, { name, value }) => setDate(value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Admin - Date poll</label>
          <Input placeholder='url ...' value={adminPoll}
            onChange={e => setAdminPoll(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>User - Date poll</label>
          <Input placeholder='url ...' value={userPoll}
            onChange={e => setUserPoll(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Sujet</label>
          <Select
            placeholder='Selectionner un sujet'
            fluid
            selection
            options={dropDownSubjects}
            value={(subjectOpt || {}).value}
            onChange={(e, data) => setSubjectOpt(dropDownSubjects.find(d => d.value === data.value))}
          />
        </Form.Field>
        <Button type='submit'>Sauvegarder</Button>
      </Form>
    </>
  );
};
