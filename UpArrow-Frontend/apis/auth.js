import axios from 'axios';
import { env } from '../config';

const auth = {
  authenticate: (code) => () =>
    axios
      .post(`${env.serverUrl}/oauth/auth`, null, {
        params: { code },
      })
      .then((res) => res.data),
};

export default auth;
