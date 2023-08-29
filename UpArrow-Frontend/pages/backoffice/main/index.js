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

const BackofficeStockList = () => {
  const { data: config, isLoading } = useQuery(["config"], api.config.get);
  const [bannerImage, setBannerImage] = useState();
  const [boardImage, setBoardImage] = useState();
  const [chartImage, setChartImage] = useState();
  const [name, setName] = useState(config?.board?.name);
  const [color, setColor] = useState(config?.board?.color);
  const [ticker, setTicker] = useState(config?.board?.ticker);
  const [importantDatePrice, setImportantDatePrice] = useState(
    config?.board?.importantDatePrice
  );
  const [importantDateString, setImportantDateString] = useState(
    config?.board?.importantDateString
      ? new Date(config?.board?.importantDateString)
      : undefined
  );
  const [dotLocation, setDotLocation] = useState(
    config?.board?.dotLocation || 0
  );

  const [boards, setBoards] = useState(config?.boards || []);

  useEffect(() => {
    if (!isLoading) {
      setBoards(config?.boards || []);
    }
  }, [isLoading]);

  const save = async () => {
    // if (!bannerImage || !boardImage || !chartImage) return alert("no image");

    const bannerImageUrl = await getUploadUrl(
      bannerImage,
      config?.bannerImageUrl
    );
    const boardImageUrl = await getUploadUrl(
      boardImage,
      config?.board?.imageUrl
    );
    const chartImageUrl = await getUploadUrl(
      chartImage,
      config?.board?.chartImageUrl
    );

    const res = await api.config.put({
      bannerImageUrl,
      board: {
        name,
        color,
        ticker,
        importantDateString,
        importantDatePrice,
        dotLocation,
        imageUrl: boardImageUrl,
        chartImageUrl,
      },
      boards,
    })();
  };

  return (
    <BackofficeMain>
      <BackofficeHeader title="Main" />
      <div className="table-wrapper">
        <Table
          columns={[
            "Image",
            "Stock name",
            "Youtube URL",
            "Created at",
            "Updated at",
          ]}
          datas={boards.map((board) => {
            return [
              `http://img.youtube.com/vi/${board?.youtubeCode}/0.jpg`,
              board?.stockName,
              board?.youtubeCode,
              getYMD(new Date(), ". "),
              getYMD(new Date(), ". "),
            ];
          })}
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
          <BackofficeStockList />
        </BackofficeLayout>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};

export default App;
