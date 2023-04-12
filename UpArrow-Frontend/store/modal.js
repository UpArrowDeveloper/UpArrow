import { atom } from 'recoil';

const modalState = atom({
  key: 'modalState', // unique ID (with respect to other atoms/selectors)
  default: {
    visible: false,
    children: null,
    onConfirm: () => {},
  },
});

export default modalState;
