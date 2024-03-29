import axios from "axios";
import { env } from "../config";

const order = {
  getById: (id) => () =>
    axios.get(`${env.serverUrl}/order/${id}`).then((res) => res.data),
  getByIds: (ids) => () =>
    axios.get(`${env.serverUrl}/order/${ids}/ids`).then((res) => res.data),
  post: (data) => {
    try {
      return axios.post(`${env.serverUrl}/order`, { ...data });
    } catch (error) {
      throw error;
    }
  },
};

export default order;
