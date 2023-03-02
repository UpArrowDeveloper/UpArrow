import { atom } from 'recoil';
import backofficeConfig from '../config';

export const menuState = atom({
  key: 'menuState',
  default: backofficeConfig.menus[0],
});
