import axios from "axios";
import { env } from "../config";

const auth = {
  authenticate: (code) => () =>
    axios
      .post(`${env.serverUrl}/oauth/auth`, null, {
        params: { code },
      })
      .then((res) => res.data),
  npcLogin: async ({ id, password }) => {
    return axios
      .post(`${env.serverUrl}/oauth/local/npc-login`, { id, password })
      .then((res) => res.data);
  },
  customLogin: async ({ email, password }) => {
    return axios
      .post(`${env.serverUrl}/oauth/local/auth`, { email, password })
      .then((res) => res.data);
  },
  customSignup: async ({ email, name }) => {
    return axios
      .post(`${env.serverUrl}/oauth/local/signup`, { email, name })
      .then((res) => res.data);
  },
};

export default auth;
