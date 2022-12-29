import axios from 'axios';
import { env } from '../config';

const post = {
  get: () => axios.get(`${env.serverUrl}/post`).then((res) => res.data),
  getById: (id) => () =>
    axios.get(`${env.serverUrl}/post/${id}`).then((res) => res.data),
  put: (data) => () =>
    axios.put(`${env.serverUrl}/post`, { data }).then((res) => res.data),
};

export default post;
