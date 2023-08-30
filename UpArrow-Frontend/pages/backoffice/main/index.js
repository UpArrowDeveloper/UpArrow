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
  const { data: banner, isLoading } = useQuery(["banner"], api.banner.get);
  const router = useRouter();

  return (
    <BackofficeMain>
      <BackofficeHeader
        title="Main"
        onClick={() => router.push("/backoffice/main/add")}
      />
      <div className="table-wrapper">
        <Table
          columns={[
            "Image",
            "Stock name",
            "Youtube URL",
            "Created at",
            "Updated at",
          ]}
          datas={
            banner?.map((banner) => {
              return {
                id: banner._id,
                items: [
                  `http://img.youtube.com/vi/${banner?.youtubeCode}/0.jpg`,
                  banner?.stockName,
                  banner?.youtubeCode,
                  getYMD(new Date(banner?.createdAt), ". "),
                  getYMD(new Date(banner?.updatedAt), ". "),
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
