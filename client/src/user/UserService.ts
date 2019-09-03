import axios from 'axios';

export class User {
  sub: string
  name: string
  given_name: string
  family_name: string
  profile: string
  picture: string
  email: string
  email_verified: boolean
  hd: string
}

export class UserService {

  loadAuthenticatedUser() {
    return axios.get('/api/users/current')
      .then((response) => {
        console.log(response);
        return response.data;
      });
  };

}
