import axios from 'axios';
import { env } from '../config';

const price = {
  get: (stockId, userId) => () =>
    axios
      .get(`${env.serverUrl}/price`, { params: { stockId, userId } })
      .then((res) => res.data),
};

export default price;
