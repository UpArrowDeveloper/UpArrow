import axios from 'axios';

const config = {
  get: () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/config`)
      .then((res) => res.data),
  put: (data) => () =>
    axios
      .put(`${process.env.NEXT_PUBLIC_SERVER_URL}/config`, data)
      .then((res) => res.data),
};

export default config;
