import React from 'react';
import styled from '@emotion/styled';

const LogoBlock = styled.img`
  width: 13.8rem;
  height: 13.8rem;
  border: solid 0.1rem #dee0e3;
  box-shadow: 0rem 0rem 0.2rem #c4c7cc;
  border-radius: 999rem;
  cursor: pointer;
  :hover {
    border: 0.1rem solid gray;
  }
  object-fit: contain;
`;

const Logo = ({ logoUrl }) => {
  return <LogoBlock src={logoUrl} />;
};

export default Logo;
