import { Dojo } from './model';
import axios from 'axios';

export default class DojoService {
  list () : Promise<Array<Dojo>> {
    return axios.get(`/api/dojos`)
      .then((response) => {
        return response.data;
      });
  }
}
