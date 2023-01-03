import axios from 'axios';
import { env } from '../config';

const order = {
  getById: (id) => () =>
    axios.get(`${env.serverUrl}/order/${id}`).then((res) => res.data),
  post: (data) =>
    axios.post(`${env.serverUrl}/order`, { ...data }).then((res) => res.data),
};

export default order;
