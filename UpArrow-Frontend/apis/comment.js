import axios from 'axios';
import { env } from '../config';

const comment = {
  get: () => axios.get(`${env.serverUrl}/comment`).then((res) => res.data),
  getId: (id) => () =>
    axios.get(`${env.serverUrl}/comment/${id}`).then((res) => res.data),
  getByStockId: (stockId) => () =>
    axios
      .get(`${env.serverUrl}/comment/${stockId}/stock`)
      .then((res) => res.data),
  getByIds: (ids) => () =>
    axios.get(`${env.serverUrl}/comment/${ids}/ids`).then((res) => res.data),
  post: (data) => () => axios.post(`${env.serverUrl}/comment`, data),
  put: (data) => () =>
    axios.put(`${env.serverUrl}/comment`, { data }).then((res) => res.data),
};

export default comment;
