import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import color from '../../styles/color';

const buttonCssCreator = (theme) => {
  if (theme === 'primary') {
    return css`
      background-color: ${color.UpArrow_Blue};
      color: white;
    `;
  }
  return css`
    background-color: red;
  `;
};

const ButtonBlock = styled.button`
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 2.2rem;

  padding: 1rem;
  border: none;
  border-radius: 0.8rem;

  cursor: pointer;

  ${({ theme }) => buttonCssCreator(theme)}
`;

const Button = ({ children, theme = 'primary', ...props }) => {
  return (
    <ButtonBlock {...props} theme={theme}>
      {children}
    </ButtonBlock>
  );
};

export default Button;
