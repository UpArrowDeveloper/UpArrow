// material-ui
import { StyledEngineProvider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import api from "../../../apis";
import BackofficeLayout from "../../../Layouts/Backoffice";
import { getUploadUrl } from "../../../utils/file";
import styled from "@emotion/styled";
import BackofficeHeader from "../../../backoffice/components/common/Header";
import { HeadH3Bold, HeadH5Bold } from "../../../styles/typography";
import TitleInput from "../../../backoffice/components/common/TitleInput";
import Divider from "../../../components/Divider";
import color from "../../../styles/color";
import { useRouter } from "next/router";
import { FileUploader } from "../../../backoffice/components/common/FileUploader";

const BackofficeStockAdd = () => {
  const [stockName, setStockName] = useState();
  const [ticker, setTicker] = useState();
  const [currentPrice, setCurrentPrice] = useState();
  const [targetPrice, setTargetPrice] = useState();
  const [description, setDescription] = useState();
  const [youtubeCode, setYoutubeCode] = useState();
  const router = useRouter();
  const submit = async () => {
    await api.banner.post({
      stockName,
      description,
      youtubeCode,
    });
    router.push("/backoffice/main");
  };

  const stock = null;
  const [logoImage, setLogoImage] = useState();

  return (
    <BackofficeMain>
      <BackofficeHeader title="Add Stock" />
      <div className="backoffice-sub-title">Stock Info</div>
      <FileUploader
        name="stockImage"
        file={logoImage}
        url={stock?.logoUrl}
        setImage={setLogoImage}
      />
      <TitleInput
        title="Stock name"
        value={stockName}
        onChange={(v) => setStockName(v.target.value)}
      />
      <TitleInput
        title="Ticker"
        value={ticker}
        onChange={(v) => setTicker(v.target.value)}
      />
      <TitleInput
        title="Current Price"
        value={currentPrice}
        onChange={(v) => setCurrentPrice(v.target.value)}
      />
      <TitleInput
        title="Target Price"
        value={targetPrice}
        onChange={(v) => setTargetPrice(v.target.value)}
      />
      <TitleInput
        title="Description"
        onChange={(v) => {
          setDescription(v.target.value);
        }}
      />
      <TitleInput
        title="Youtube Code"
        onChange={(e) => setYoutubeCode(e.target.value)}
      />
      <Divider className="divider" />
      <div className="add-button-wrapper">
        <button onClick={() => submit()}>Add</button>
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

  .backoffice-sub-title {
    padding: 2.4rem 3.2rem;
    padding-top: 0;
    ${HeadH3Bold}
  }

  .divider {
    margin-top: 2.4rem;
  }

  .thumbnail {
    width: 48rem;
    height: 27rem;
    margin-bottom: 2.4rem;
  }

  .add-button-wrapper {
    display: flex;
    justify-content: flex-end;

    button {
      width: 24rem;
      height: 5.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: #3d67ff;
      ${HeadH5Bold}
      color: ${color.B96}
    }
  }
`;

const App = () => {
  return (
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <BackofficeLayout>
          <BackofficeStockAdd />
        </BackofficeLayout>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};

export default App;
