import styled from '@emotion/styled';

const MainLayoutBlock = styled.main`
  display: flex;
  justify-content: center;

  .content {
    width: 128rem;
  }
`;

const MainLayout = ({ children }) => {
  return (
    <MainLayoutBlock className='mainlayout'>
      <div className='content'>{children}</div>
    </MainLayoutBlock>
  );
};

export default MainLayout;
