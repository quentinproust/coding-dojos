import { Subject } from "./model";
import axios from 'axios';

export default class SubjectService {
  list(): Promise<Array<Subject>> {
    return axios.get(`/api/subjects`)
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
}
