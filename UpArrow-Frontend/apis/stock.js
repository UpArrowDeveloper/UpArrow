import axios from 'axios';
import { env } from '../config';

const stock = {
  get: () => axios.get(`${env.serverUrl}/stock`).then((res) => res.data),
  getById: (id) => () =>
    axios.get(`${env.serverUrl}/stock/${id}`).then((res) => res.data),
  getByIds: (ids) => () =>
    axios.get(`${env.serverUrl}/stock/${ids}/ids`).then((res) => res.data),
  put: (data) => () =>
    axios.put(`${env.serverUrl}/stock`, { data }).then((res) => res.data),
  savePriceById: (id, data) => () =>
    axios
      .put(`${env.serverUrl}/stock/${id}/price`, data)
      .then((res) => res.data),
  getIdeasById: (id) => () =>
    axios.get(`${env.serverUrl}/stock/${id}/ideas`).then((res) => res.data),
  deleteById: (id) =>
    axios.delete(`${env.serverUrl}/stock/${id}`).then((res) => res.data),
};

export default stock;
