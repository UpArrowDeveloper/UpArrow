import axios from 'axios';
import { env } from '../config';

const user = {
  getByEmail: (id) => () =>
    axios.get(`${env.serverUrl}/user/${id}/email`).then((res) => res.data),
};

export default user;
