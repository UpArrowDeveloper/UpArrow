import { BackofficeNavbar } from "../backoffice/components/BackofficeNavbar";
import React, { useEffect } from "react";
import styled from "@emotion/styled";
import api from "../apis";

const BackofficeLayout = ({ children }) => {
  useEffect(async () => {
    try {
      const { user } = await api.user.me();
      const config = await api.config.get();
      const adminEmails = config.adminEmails;
      if (!adminEmails.includes(user.email)) {
        throw new Error("권한이 없습니다.");
      }
    } catch (e) {
      alert("권한이 없습니다.");
      window.location.href = "/";
    }
  }, []);
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
