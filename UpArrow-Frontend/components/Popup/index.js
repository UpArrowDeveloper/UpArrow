import React from "react";
import styled from "@emotion/styled";
import useModal from "../../hooks/useModal";

export const Popup = () => {
  const { modal, closeModal } = useModal();
  return (
    <>
      <PopupBlock
        className={!modal.visible ? "hidden" : ""}
        onClick={() => {
          closeModal();
          modal.onOutsideClick && modal.onOutsideClick();
        }}
      />

      {modal.children && (
        <PopupWrapper>
          <modal.children onConfirm={modal.onConfirm} />
        </PopupWrapper>
      )}
    </>
  );
};

const PopupBlock = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  &.hidden {
    display: none;
  }
`;

const PopupWrapper = styled.div`
  position: fixed;
  z-index: 100;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
`;
