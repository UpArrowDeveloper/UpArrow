import { useRecoilState } from "recoil";
import modalState from "../store/modal";

const useModal = () => {
  const [modal, setModal] = useRecoilState(modalState);

  const openModal = ({ children, onConfirm }) => {
    setModal({
      visible: true,
      children,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModal({
      visible: false,
      children: null,
      onConfirm: () => {},
    });
  };

  return {
    modal,
    openModal,
    closeModal,
  };
};

export default useModal;
