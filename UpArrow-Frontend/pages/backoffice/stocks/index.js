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
  const { data, refetch } = useQuery(["stock list"], api.stock.get);
  const router = useRouter();

  if (!data) return "loading";
  return (
    <BackofficeMain>
      <BackofficeHeader
        title="Stock"
        onClick={() => router.push("/backoffice/stocks/new")}
      />
      <div className="table-wrapper">
        <Table
          columns={[
            "Image",
            "Stock name",
            "Ticker",
            "Current Price",
            "Target Price",
            "Created at",
            "Updated at",
          ]}
          datas={
            data?.map((stock) => {
              return {
                id: stock._id,
                items: [
                  stock.logoUrl,
                  stock.name,
                  stock.ticker,
                  `$${stock.currentPrice}`,
                  `$${stock.targetPrices?.[0]?.price || 0}`,
                  getYMD(new Date(stock.createdAt), ". "),
                  getYMD(new Date(stock.updatedAt), ". "),
                ],
              };
            }) || []
          }
          gridTemplateColumns={[
            "7.2rem",
            "2fr",
            "0.8fr",
            "0.8fr",
            "0.8fr",
            "0.8fr",
            "0.8fr",
          ]}
          onEdit={(id) => {
            router.push(`/backoffice/stocks/${id}`);
            refetch();
          }}
          onDelete={async (id) => {
            await api.stock.deleteById(id);
            router.reload();
          }}
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
