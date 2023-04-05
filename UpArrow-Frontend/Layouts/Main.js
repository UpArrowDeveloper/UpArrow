import styled from '@emotion/styled';
import { useRef } from 'react';
import Navbar, { navbarHeight } from '../components/Navbar';

const MainLayoutBlock = styled.main`
  margin-top: ${navbarHeight};
  display: flex;
  justify-content: center;

  .content {
    width: 128rem;
  }
`;

const MainLayout = ({ children }) => {
  return (
    <MainLayoutBlock className='mainlayout'>
      <Navbar />
      <div className='content'>{children}</div>
    </MainLayoutBlock>
  );
};

export default MainLayout;
