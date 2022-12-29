import axios from 'axios';
import { env } from '../config';

const vote = {
  getByPostId: (postId) => () =>
    axios.get(`${env.serverUrl}/vote/${postId}/post`).then((res) => res.data),
  post: (data) =>
    axios.post(`${env.serverUrl}/vote`, { ...data }).then((res) => res.data),
};

export default vote;
