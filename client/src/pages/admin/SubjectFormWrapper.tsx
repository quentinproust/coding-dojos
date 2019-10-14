import * as React from 'react';
import { Button, Input, Header, Form, Checkbox } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { useServices } from '../../services';
import { Subject } from '../../services/model';

export default ({ match: { params: { id: urlId } } }) => {
  const [id, setId] = React.useState("");
  const [theme, setTheme] = React.useState("");
  const [active, setActive] = React.useState(false);

  const { saveSubject, getSubject } = useServices(s => ({
    saveSubject: s.subjectService.save,
    getSubject: s.subjectService.get,
  }));

  React.useEffect(() => {
    if (!urlId) return;

    getSubject(urlId)
      .then(s => {
        if (!s) return;

        setId(s.id);
        setTheme(s.theme);
        setActive(s.active);
      })
      .catch(console.error)
  }, [urlId]);

  const handleSubmit = () => {
    const subject = new Subject();
    if (id) {
      subject.id = id;
    }
    subject.theme = theme;
    subject.active = active;

    saveSubject(subject).then(s => {
        setId(s.id);
        setTheme(s.theme);
        setActive(s.active);

        window.location.assign(`/admin/subjects/${s.id}/edit`)
      })
      .catch(console.error);
  };

  return (
    <>
      <Header as='h1'>{!id ? 'Ajout d\'un sujet' : 'Mettre à jour un sujet'}</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Id</label>
          <Input readOnly value={id} />
        </Form.Field>
        <Form.Field>
          <label>Thème</label>
          <Input placeholder='Thème' value={theme}
            onChange={e => setTheme(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox label='Actif'
            checked={active}
            onChange={(e, { checked }) => setActive(checked)}
          />
        </Form.Field>
        <Button type='submit'>Sauvegarder</Button>
      </Form>
    </>
  );
};
