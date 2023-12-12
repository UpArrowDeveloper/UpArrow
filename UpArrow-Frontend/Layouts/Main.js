import styled from "@emotion/styled";
import Navbar, { navbarHeight } from "../components/Navbar";
import { mobileWidth } from "../styles/responsive";

const MainLayoutBlock = styled.main`
  margin-top: ${({ isMain }) => (isMain ? "3.2rem" : 0)};
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

const MainLayout = ({ children, isMain = false, Banner }) => {
  return (
    <>
      <Navbar />
      {isMain && <Banner />}
      <MainLayoutBlock className="mainlayout" isMain={isMain}>
        <div className="content">{children}</div>
      </MainLayoutBlock>
    </>
  );
};

export default MainLayout;
