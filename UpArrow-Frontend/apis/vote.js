import axios from 'axios';
import { env } from '../config';

const vote = {
  getByIdeaId: (ideaId) => () =>
    axios.get(`${env.serverUrl}/vote/${ideaId}/idea`).then((res) => res.data),
  post: (data) =>
    axios.post(`${env.serverUrl}/vote`, { ...data }).then((res) => res.data),
};

export default vote;
