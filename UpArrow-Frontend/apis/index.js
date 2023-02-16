import config from './config';
import stock from './stock';
import vote from './vote';
import user from './user';
import comment from './comment';
import order from './order';
import price from './price';
import idea from './idea';
import auth from './auth';
import storage from '../utils/storage';
import axios from 'axios';

axios.defaults.headers['Authorization'] = storage.get('access_token');

const api = {
  config,
  stock,
  vote,
  user,
  comment,
  order,
  price,
  idea,
  auth,
};

export default api;
