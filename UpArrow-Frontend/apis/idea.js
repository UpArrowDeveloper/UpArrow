import axios from 'axios';
import { env } from '../config';

const idea = {
  getIds: (ids) => () =>
    axios.get(`${env.serverUrl}/idea/${ids}/ids`).then((res) => res.data),
};

export default idea;
