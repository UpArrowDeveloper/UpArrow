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
import { getYMD } from "../../../utils/date";
import styled from "@emotion/styled";
import BackofficeHeader from "../../../backoffice/components/common/Header";
import Table from "../../../backoffice/components/common/Table";
import { useRouter } from "next/router";
import DndTable from "../../../backoffice/components/common/DnDTable";

const BackofficeBannerList = () => {
  const { data: banner, refetch } = useQuery(["banner"], api.banner.get);
  const router = useRouter();

  return (
    <BackofficeMain>
      <BackofficeHeader
        title="Main"
        onClick={() => router.push("/backoffice/main/add")}
      />
      <div className="table-wrapper">
        <DndTable
          onDragEnd={async (result) => {
            const destinationIndex = result.destination?.index;
            const sourceIndex = result.source?.index;
            let arr = [];
            if (destinationIndex === sourceIndex) return;
            if (destinationIndex > sourceIndex) {
              for (let i = sourceIndex + 1; i <= destinationIndex; i++) {
                arr.push(
                  api.banner.put(banner[i]._id, {
                    order: i - 1,
                  })
                );
              }
              await Promise.all(arr);
              await api.banner.put(banner[sourceIndex]._id, {
                order: destinationIndex,
              });
            } else {
              for (let i = destinationIndex; i < sourceIndex; i++) {
                arr.push(
                  api.banner.put(banner[i]._id, {
                    order: i + 1,
                  })
                );
              }
              await Promise.all(arr);
              await api.banner.put(banner[sourceIndex]._id, {
                order: destinationIndex,
              });
            }

            await refetch();
          }}
          columns={[
            "Image",
            "Stock name",
            "Youtube URL",
            "Created at",
            "Updated at",
          ]}
          datas={
            banner
              ?.sort((a, b) => a.order - b.order)
              .map((banner) => {
                return {
                  id: banner._id,
                  items: [
                    banner?.thumbnailUrl,
                    banner?.stockName,
                    banner?.youtubeCode,
                    getYMD(new Date(banner?.createdAt), ". "),
                    getYMD(new Date(banner?.updatedAt), ". "),
                  ],
                };
              }) || []
          }
          gridTemplateColumns={["7.2rem", "2fr", "0.8fr", "0.8fr", "0.8fr"]}
          onEdit={(id) => {
            router.push(`/backoffice/main/${id}/edit`);
            refetch();
          }}
          onDelete={async (id) => {
            await api.banner.delete(id);
            router.reload();
          }}
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
