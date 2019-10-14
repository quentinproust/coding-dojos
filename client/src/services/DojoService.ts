import { Dojo } from './model';
import axios from 'axios';

export default class DojoService {
  list () : Promise<Array<Dojo>> {
    return axios.get(`/api/dojos`)
      .then((response) => {
        return response.data;
      });
  }

  get(id: string): Promise<Dojo> {
    return axios.get(`/api/dojos/${id}`)
      .then((response) => {
        return response.data;
      });
  }

  save(dojo: Dojo): Promise<Dojo> {
    const callMethod = !dojo.id ? axios.post : axios.put;

    return callMethod('/api/dojos', dojo)
      .then((response) => {
        return response.data;
      });
  }
}
