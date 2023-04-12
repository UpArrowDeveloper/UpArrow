import React from 'react';
import styled from '@emotion/styled';
import useModal from '../../hooks/useModal';

export const Popup = () => {
  const { modal } = useModal();
  return (
    <PopupBlock className={!modal.visible ? 'hidden' : ''}>
      {modal.children && <modal.children onConfirm={modal.onConfirm} />}
    </PopupBlock>
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
