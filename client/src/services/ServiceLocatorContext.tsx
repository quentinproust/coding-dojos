import React from 'react';
import DojoService from './DojoService';
import SubjectService from './SubjectService';

export interface Services {
  dojoService: DojoService,
  subjectService: SubjectService
}

const ServiceLocatorContext = React.createContext<Services>({
  dojoService: new DojoService(),
  subjectService: new SubjectService()
});

export default ServiceLocatorContext;
