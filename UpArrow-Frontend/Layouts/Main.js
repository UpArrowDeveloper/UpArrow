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
  const stockRef = useRef(null);
  const ideaRef = useRef(null);
  const investorRef = useRef(null);
  return (
    <MainLayoutBlock className='mainlayout'>
      <Navbar
        stockRef={stockRef}
        ideaRef={ideaRef}
        investorRef={investorRef}
      ></Navbar>
      <div className='content'>{children}</div>
    </MainLayoutBlock>
  );
};

export default MainLayout;
