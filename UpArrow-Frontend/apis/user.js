import axios from 'axios';
import { env } from '../config';

const user = {
  getById: (id) => () =>
    axios.get(`${env.serverUrl}/user/${id}`).then((res) => res.data),
  getByEmail: (id) => () =>
    axios.get(`${env.serverUrl}/user/${id}/email`).then((res) => res.data),
};

export default user;
