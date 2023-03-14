import axios from 'axios';
import { env } from '../config';

const analysis = {
  getById: (id) => () =>
    axios.get(`${env.serverUrl}/analysis/${id}`).then((res) => res.data),
};

export default analysis;
