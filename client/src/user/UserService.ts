import axios from 'axios';

export class User {
  sub: string
  name: string
  profile: string | null
  picture: string | null
  email: string
  email_verified: boolean
  hd: string | null
  grantedAuthorities: Array<string>
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
