import axios from 'axios';
import { env } from '../config';

const idea = {
  get: (params) =>
    axios.get(`${env.serverUrl}/idea`, params).then((res) => res.data),
  getById: (id) => () =>
    axios.get(`${env.serverUrl}/idea/${id}`).then((res) => res.data),
  getByIds: (ids) => () =>
    axios.get(`${env.serverUrl}/idea/${ids}/ids`).then((res) => res.data),
  getByUserId: (userId) => () =>
    axios.get(`${env.serverUrl}/idea/${userId}/userId`).then((res) => res.data),
};

export default idea;
