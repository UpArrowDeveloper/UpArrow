import axios from 'axios';
import { env } from '../config';

const comment = {
  get: () => axios.get(`${env.serverUrl}/comment`).then((res) => res.data),
  getId: (id) => () =>
    axios.get(`${env.serverUrl}/comment/${id}`).then((res) => res.data),
  getByIds: (ids) => () => {
    console.log('ids : ', ids);
    if (ids.length === 0) return [];
    return axios
      .get(`${env.serverUrl}/comment/ids`, { params: { ids: ids.join(',') } })
      .then((res) => res.data);
  },
  put: (data) => () =>
    axios.put(`${env.serverUrl}/comment`, { data }).then((res) => res.data),
};

export default comment;
