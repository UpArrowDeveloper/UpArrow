import { useRecoilState } from "recoil";
import modalState from "../store/modal";

const useModal = () => {
  const [modal, setModal] = useRecoilState(modalState);

  const openModal = ({ children, onConfirm, onOutsideClick }) => {
    setModal({
      visible: true,
      children,
      onConfirm,
      onOutsideClick,
    });
  };

  const closeModal = () => {
    setModal({
      visible: false,
      children: null,
      onConfirm: () => {},
      onOutsideClick: () => {},
    });
  };

  return {
    modal,
    openModal,
    closeModal,
  };
};

export default useModal;
