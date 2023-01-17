import axios from 'axios';
import { env } from '../config';

const url = `${env.serverUrl}/user`;
const user = {
  get: () => axios.get(url).then((res) => res.data),
  getById: (id) => () => axios.get(`${url}/${id}`).then((res) => res.data),
  getByEmail: (email) => () =>
    axios.get(`${url}/${email}/email`).then((res) => res.data),
  post: (payload) => axios.post(url, payload).then((res) => res.data),
};

export default user;
