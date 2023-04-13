import styled from '@emotion/styled';
import React from 'react';

const Divider = () => {
  return <DividerBlock />;
};

const DividerBlock = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e5e5e5;
  margin: 2.4rem 0;
`;

export default Divider;
