import styled from "@emotion/styled";
import Navbar, { navbarHeight } from "../components/Navbar";

const MainLayoutBlock = styled.main`
  margin-top: ${({ isMain }) => (isMain ? "3.2rem" : navbarHeight)};
  display: flex;
  justify-content: center;

  .content {
    width: 128rem;
  }
`;

const MainLayout = ({ children, isMain = false }) => {
  return (
    <MainLayoutBlock className="mainlayout" isMain={isMain}>
      <Navbar />
      <div className="content">{children}</div>
    </MainLayoutBlock>
  );
};

export default MainLayout;
