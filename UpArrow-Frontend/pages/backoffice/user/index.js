// material-ui
import { StyledEngineProvider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import api from "../../../apis";
import FilePreview from "../../../components/common/FilePreview";
import { env } from "../../../config";
import BackofficeLayout from "../../../Layouts/Backoffice";
import { getBannerYMD, getYMD } from "../../../utils/date";
import { getUploadUrl } from "../../../utils/file";
import { Boards } from "../../../backoffice/components/settings/Boards";
import styled from "@emotion/styled";
import BackofficeHeader from "../../../backoffice/components/common/Header";
import Table from "../../../backoffice/components/common/Table";
import { useRouter } from "next/router";

const BackofficeBannerList = () => {
  const { data: users, isLoading } = useQuery(["users"], api.user.get);
  const router = useRouter();

  return (
    <BackofficeMain>
      <BackofficeHeader
        title="User"
        onClick={() => router.push("/backoffice/main/add")}
      />
      <div className="table-wrapper">
        <Table
          columns={["Image", "Name", "User Name", "Email", "Sign up at"]}
          datas={
            users?.map((user) => {
              return {
                id: user._id,
                items: [
                  user.profileImageUrl,
                  user?.name,
                  user?.username,
                  user?.email,
                  getYMD(new Date(user?.createdAt), ". "),
                ],
              };
            }) || []
          }
          gridTemplateColumns={["7.2rem", "2fr", "0.8fr", "0.8fr", "0.8fr"]}
        />
      </div>
    </BackofficeMain>
  );
};

const BackofficeMain = styled.div`
  h1 {
    font-size: 4.8rem;
    font-weight: 600;
  }

  .table-wrapper {
    padding: 2.4rem 3.2rem;
  }
`;

const App = () => {
  return (
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <BackofficeLayout>
          <BackofficeBannerList />
        </BackofficeLayout>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};

export default App;
