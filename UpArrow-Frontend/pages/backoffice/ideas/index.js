import { useQuery } from "@tanstack/react-query";

import React from "react";
import { RecoilRoot } from "recoil";
import api from "../../../apis";
import BackofficeLayout from "../../../Layouts/Backoffice";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import BackofficeHeader from "../../../backoffice/components/common/Header";
import Table from "../../../backoffice/components/common/Table";
import { getYMD } from "../../../utils/date";

const BackofficeStockList = () => {
  const { data, refetch } = useQuery(["idea list"], api.idea.get);
  const router = useRouter();

  if (!data) return "loading";
  return (
    <BackofficeMain>
      <BackofficeHeader title="Idea" />
      <div className="table-wrapper">
        <Table
          columns={["Image", "Title", "Comment", "Created at", "Updated at"]}
          datas={
            data?.map((idea) => {
              return {
                id: idea._id,
                items: [
                  idea.thumbnailImageUrl,
                  idea.title,
                  idea.commentIds.length,
                  getYMD(new Date(idea.createdAt), ". "),
                  getYMD(new Date(idea.updatedAt), ". "),
                ],
              };
            }) || []
          }
          onDelete={async (id) => {
            await api.idea.deleteById(id);
            router.reload();
          }}
          onEdit={(id) => {
            router.replace(`/editor/${id}`);
          }}
          gridTemplateColumns={["7.2rem", "2fr", "0.8fr", "0.8fr", "0.8fr"]}
        />
      </div>
    </BackofficeMain>
  );
};

const App = () => {
  return (
    <RecoilRoot>
      <BackofficeLayout>
        <BackofficeStockList />
      </BackofficeLayout>
    </RecoilRoot>
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

export default App;
