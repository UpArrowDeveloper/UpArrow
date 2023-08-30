import axios from "axios";

const banner = {
  get: () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/banner`)
      .then((res) => res.data),
  getById: (id) => () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/banner/${id}`)
      .then((res) => res.data),
  post: (data) =>
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/banner`, data)
      .then((res) => res.data),
  put: (id, data) =>
    axios
      .put(`${process.env.NEXT_PUBLIC_SERVER_URL}/banner/${id}`, data)
      .then((res) => res.data),
  delete: (id) =>
    axios
      .delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/banner/${id}`)
      .then((res) => res.data),
};

export default banner;
