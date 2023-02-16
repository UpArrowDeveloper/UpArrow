import axios from 'axios';
import { env } from '../config';

const url = `${env.serverUrl}/user`;
const user = {
  get: () => axios.get(url).then((res) => res.data),
  me: () => axios.get(`${url}/me`).then((res) => res.data),
  getTop3StocksById: (id) =>
    axios.get(`${url}/${id}/top3stocks`).then((res) => res.data),
  getProfitPercentageById: (id, params) =>
    axios.get(`${url}/${id}/profit-percentage`, params).then((res) => res.data),
  getById: (id) => () => axios.get(`${url}/${id}`).then((res) => res.data),
  getIdeasById: (id) => () =>
    axios.get(`${url}/${id}/ideas`).then((res) => res.data),
  getRankById: (id) => () =>
    axios.get(`${url}/${id}/rank`).then((res) => res.data),
  getByEmail: (email) => () =>
    axios.get(`${url}/${email}/email`).then((res) => res.data),
  post: (payload) => axios.post(url, payload).then((res) => res.data),
  updateById: (id, payload) =>
    axios.put(`${url}/${id}`, payload).then((res) => res.data),
};

export default user;
