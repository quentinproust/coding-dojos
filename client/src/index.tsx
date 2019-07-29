import ReactDOM from 'react-dom';
import * as React from 'react';
import { DojoList, NewDojoForm } from './dojos';
import { DojoIdeas } from './dojoIdeas';
import { DatePolls } from './datePolls';

ReactDOM.render(
  (
    <>
      <h1>Coding Dojos !</h1>
      <DojoList />
      <NewDojoForm />
    </>
  ),
  document.getElementById('root')
);
