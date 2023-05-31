import styled from "@emotion/styled";
import Navbar, { navbarHeight } from "../components/Navbar";
import { mobileWidth } from "../styles/responsive";

const MainLayoutBlock = styled.main`
  margin-top: ${({ isMain }) => (isMain ? "3.2rem" : navbarHeight)};
  display: flex;
  justify-content: center;

  .content {
    width: 128rem;
  }

  @media screen and (max-width: ${mobileWidth}) {
    .content {
      width: 100%;
    }
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
