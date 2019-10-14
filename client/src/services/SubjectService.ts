import { Subject } from "./model";
import axios from 'axios';

export default class SubjectService {
  list(): Promise<Array<Subject>> {
    return axios.get(`/api/subjects`)
      .then((response) => {
        return response.data;
      });
  }

  get(id): Promise<Subject | null> {
    return axios.get(`/api/subjects/${id}`)
      .then((response) => {
        return response.data;
      });
  }

  toggleInterest(subjectId: String): Promise<any> {
    return axios.post(`/api/subjects/${subjectId}/interest`)
      .then((response) => {
        return response.data;
      });
  }

  save(subject: Subject): Promise<Subject> {
    const callMethod = !subject.id ? axios.post : axios.put;

    return callMethod('/api/subjects', subject)
      .then((response) => {
        return response.data;
      });
  }
}
