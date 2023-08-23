import { BackofficeNavbar } from "../backoffice/components/BackofficeNavbar";
import React from "react";
import styled from "@emotion/styled";

const BackofficeLayout = ({ children }) => {
  return (
    <Layout>
      <BackofficeNavbar />
      <div className="backoffice-layout-wrapper">
        <div className="bo-wrapper-content">{children}</div>
      </div>
    </Layout>
  );
};

const Layout = styled.div`
  .backoffice-layout-wrapper {
    margin-top: 4.8rem;
    display: flex;
    justify-content: center;

    .bo-wrapper-content {
      width: 100%;
      max-width: 128rem;
    }
  }
`;

export default BackofficeLayout;
